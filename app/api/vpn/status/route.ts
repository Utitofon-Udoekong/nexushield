import { NextResponse } from "next/server";
import { getConnectionSpeed, getPacketLoss } from "@/app/lib/utils";
import { createClient } from "@/app/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get active connection
    const { data: activeConnection, error: fetchError } = await supabase
      .from("vpn_connections")
      .select()
      .eq("user_id", session.user.id)
      .eq("status", "connected")
      .order("start_time", { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      return NextResponse.json({ connected: false });
    }

    // Get performance metrics
    const [downloadSpeed, packetLoss] = await Promise.all([
      getConnectionSpeed(),
      getPacketLoss(),
    ]);

    // Update connection metrics
    await supabase.from("performance_metrics").insert({
      connection_id: activeConnection.id,
      timestamp: new Date().toISOString(),
      download_speed: downloadSpeed,
      packet_loss: packetLoss,
    });

    return NextResponse.json({
      connected: true,
      country_code: activeConnection.country_code,
      start_time: activeConnection.start_time,
      data_used: activeConnection.data_used,
      download_speed: downloadSpeed,
      packet_loss: packetLoss,
    });
  } catch (error) {
    console.error("Error in status route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 