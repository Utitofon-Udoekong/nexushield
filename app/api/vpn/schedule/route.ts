import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

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

    const { data: schedules, error } = await supabase
      .from("connection_schedules")
      .select()
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching schedules:", error);
      return NextResponse.json(
        { error: "Failed to fetch schedules" },
        { status: 500 }
      );
    }

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error in schedule route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const { country_code, start_time, end_time, days_of_week } = await request.json();

    const { data: schedule, error } = await supabase
      .from("connection_schedules")
      .insert({
        user_id: session.user.id,
        country_code,
        start_time,
        end_time,
        days_of_week,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating schedule:", error);
      return NextResponse.json(
        { error: "Failed to create schedule" },
        { status: 500 }
      );
    }

    // Log security event
    await supabase.from("security_logs").insert({
      user_id: session.user.id,
      event_type: "schedule_created",
      details: {
        schedule_id: schedule.id,
        country_code,
        start_time,
        end_time,
        days_of_week,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Error in schedule route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Schedule ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("connection_schedules")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error deleting schedule:", error);
      return NextResponse.json(
        { error: "Failed to delete schedule" },
        { status: 500 }
      );
    }

    // Log security event
    await supabase.from("security_logs").insert({
      user_id: session.user.id,
      event_type: "schedule_deleted",
      details: {
        schedule_id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in schedule route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 