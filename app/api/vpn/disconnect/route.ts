import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
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
      console.error("Error fetching active connection:", fetchError);
      return NextResponse.json(
        { error: "No active connection found" },
        { status: 404 }
      );
    }

    // Update connection status
    const { error: updateError } = await supabase
      .from("vpn_connections")
      .update({
        status: "disconnected",
        end_time: new Date().toISOString(),
      })
      .eq("id", activeConnection.id);

    if (updateError) {
      console.error("Error updating connection:", updateError);
      return NextResponse.json(
        { error: "Failed to disconnect" },
        { status: 500 }
      );
    }

    // Log security event
    await supabase.from("security_logs").insert({
      user_id: session.user.id,
      event_type: "vpn_disconnected",
      ip_address: request.headers.get("x-forwarded-for") || null,
      details: {
        connection_id: activeConnection.id,
        duration: Math.floor(
          (new Date().getTime() - new Date(activeConnection.start_time).getTime()) / 1000
        ),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in disconnect route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 