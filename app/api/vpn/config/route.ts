import { NextRequest, NextResponse } from "next/server";
import { TPN_VALIDATOR_IP, TPN_API_PORT } from "@/app/lib/tpn";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get("country");
    const leaseMinutes = searchParams.get("lease_minutes");

    if (!country || !leaseMinutes) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `http://${TPN_VALIDATOR_IP}:${TPN_API_PORT}/api/config/new?format=json&geo=${country}&lease_minutes=${leaseMinutes}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch VPN config: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch VPN configuration" },
      { status: 500 }
    );
  }
} 