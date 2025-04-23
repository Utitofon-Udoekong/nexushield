import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getVPNConfig } from "@/app/lib/tpn";
import { createClient } from "@/app/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { country_code, lease_minutes = 30 } = await request.json();
    const config = await getVPNConfig(country_code, lease_minutes);

    if (!config) {
      return NextResponse.json(
        { error: "Failed to get VPN configuration" },
        { status: 500 }
      );
    }

    // Save connection to database
    const { data: connection, error } = await supabase
      .from("vpn_connections")
      .insert({
        user_id: session.user.id,
        country_code,
        config: config.peer_config,
        status: "connected",
        start_time: new Date().toISOString(),
        expires_at: new Date(config.expires_at).toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving connection:", error);
      return NextResponse.json(
        { error: "Failed to save connection" },
        { status: 500 }
      );
    }

    // Log security event
    await supabase.from("security_logs").insert({
      user_id: session.user.id,
      event_type: "vpn_connected",
      ip_address: request.headers.get("x-forwarded-for") || null,
      details: {
        country_code,
        connection_id: connection.id,
      },
    });

    return NextResponse.json(connection);
  } catch (error) {
    console.error("Error in connect route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 