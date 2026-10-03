import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Supabase Keep-Alive Healthcheck Endpoint
 * Pings Supabase site_settings to prevent free-tier project auto-pause due to 7-day inactivity.
 * Can be called via Vercel Cron, UptimeRobot, or cron-job.org.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("singleton_key, updated_at")
      .eq("singleton_key", "default")
      .single();

    if (error) {
      return NextResponse.json(
        { status: "error", message: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "ok",
      supabase: "active",
      timestamp: new Date().toISOString(),
      lastSettingsUpdate: data?.updated_at,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
