import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { createSupabaseAdminClient, createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase-server";
import { productImagesBucket } from "@/lib/storage";

async function ensureAdmin() {
  if (!hasSupabaseConfig()) {
    return false;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return Boolean(data.user?.email);
}

export async function POST(request: Request) {
  try {
    if (!(await ensureAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `products/${Date.now()}-${randomUUID()}.${ext}`;
    const supabase = await createSupabaseAdminClient();

    const { data: bucketData } = await supabase.storage.getBucket(productImagesBucket);
    if (!bucketData) {
      await supabase.storage.createBucket(productImagesBucket, {
        public: true,
        fileSizeLimit: 1_000_000,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      });
    }

    const bytes = await file.arrayBuffer();
    const { error } = await supabase.storage
      .from(productImagesBucket)
      .upload(filePath, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(productImagesBucket).getPublicUrl(filePath);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to upload image right now.",
      },
      { status: 500 },
    );
  }
}
