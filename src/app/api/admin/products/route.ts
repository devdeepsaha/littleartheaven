import { NextResponse } from "next/server";

import { saveProductFromFields } from "@/lib/admin-products";
import {
  createSupabaseServerClient,
  hasSupabaseAdminConfig,
  hasSupabaseConfig,
} from "@/lib/supabase-server";

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
    if (!hasSupabaseAdminConfig()) {
      return NextResponse.json(
        { status: "error", message: "Supabase admin write access is not configured yet." },
        { status: 503 },
      );
    }

    if (!(await ensureAdmin())) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as {
      id?: string;
      categoryId?: string;
      name?: string;
      shortDescription?: string;
      description?: string;
      price?: string | number;
      imageUrls?: string[];
      published?: boolean;
      available?: boolean;
      featured?: boolean;
    };

    const result = await saveProductFromFields(body);
    return NextResponse.json(result, {
      status: result.status === "success" ? 200 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save the product right now.",
      },
      { status: 500 },
    );
  }
}
