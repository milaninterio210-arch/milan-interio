import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify authenticated user session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify active administrator status in database
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("is_active")
      .eq("user_id", user.id)
      .single();

    if (adminError || !adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse parameters
    const body = await request.json();
    const { timestamp, folder } = body;

    if (!timestamp || !folder) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Restrict folder paths under milan-interio namespace only
    if (!folder.startsWith("milan-interio/")) {
      return NextResponse.json({ error: "Invalid upload folder path" }, { status: 400 });
    }

    // Sign the request parameters
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
