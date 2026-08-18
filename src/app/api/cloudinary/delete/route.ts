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

    // Parse deletion parameters
    const body = await request.json();
    const { publicId, resourceType = "image" } = body;

    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId parameter" }, { status: 400 });
    }

    // Restrict deletions to assets under the milan-interio namespace only
    if (!publicId.startsWith("milan-interio/")) {
      return NextResponse.json({ error: "Invalid public ID path" }, { status: 400 });
    }

    // Execute deletion via Cloudinary Server SDK
    const destroyResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    if (destroyResult.result !== "ok" && destroyResult.result !== "not_found") {
      throw new Error(`Cloudinary returned deletion status: ${destroyResult.result}`);
    }

    return NextResponse.json({ success: true, result: destroyResult.result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Deletion failed" }, { status: 500 });
  }
}
