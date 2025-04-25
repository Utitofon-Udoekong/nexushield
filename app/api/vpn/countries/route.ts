import { NextResponse } from "next/server";
import { TPN_VALIDATOR_IP, TPN_API_PORT } from "@/app/lib/tpn";

export async function GET() {
  try {
    const response = await fetch(
      `http://${TPN_VALIDATOR_IP}:${TPN_API_PORT}/api/config/countries`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
  }
} 