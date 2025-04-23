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
      return NextResponse.json(
        { error: "No active connection" },
        { status: 404 }
      );
    }

    // Get historical metrics
    const { data: metrics, error: metricsError } = await supabase
      .from("performance_metrics")
      .select()
      .eq("connection_id", activeConnection.id)
      .order("timestamp", { ascending: false })
      .limit(100);

    if (metricsError) {
      console.error("Error fetching metrics:", metricsError);
      return NextResponse.json(
        { error: "Failed to fetch metrics" },
        { status: 500 }
      );
    }

    // Get current metrics
    const [downloadSpeed, packetLoss] = await Promise.all([
      getConnectionSpeed(),
      getPacketLoss(),
    ]);

    // Update current metrics
    await supabase.from("performance_metrics").insert({
      connection_id: activeConnection.id,
      timestamp: new Date().toISOString(),
      download_speed: downloadSpeed,
      packet_loss: packetLoss,
    });

    return NextResponse.json({
      current: {
        download_speed: downloadSpeed,
        packet_loss: packetLoss,
        timestamp: new Date().toISOString(),
      },
      history: metrics,
    });
  } catch (error) {
    console.error("Error in metrics route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 