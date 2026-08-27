import { revalidatePath, revalidateTag } from "next/cache";

import { categories } from "@/data/site";
import { publicCatalogTag } from "@/lib/catalog";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase-server";
import { slugify } from "@/lib/utils";

export type SaveProductActionResult = {
  status: "success" | "error";
  message: string;
  slug?: string;
  created?: boolean;
};

export type DeleteProductActionResult = {
  status: "success" | "error";
  message: string;
  slug?: string;
  deleted?: boolean;
};

function parseCheckboxValue(value: FormDataEntryValue | string | boolean | null | undefined) {
  return value === true || value === "on" || value === "true";
}

function revalidateProductPaths(slug: string) {
  revalidateTag(publicCatalogTag, "max");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
}

async function resolveUniqueProductSlug(
  supabase: Awaited<ReturnType<typeof createSupabaseAdminClient>>,
  baseSlug: string,
  productId?: string,
) {
  let candidate = baseSlug;
  let attempt = 1;

  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data || data.id === productId) {
      return candidate;
    }

    attempt += 1;
    candidate = `${baseSlug}-${attempt}`;
  }
}

export async function saveProductFromFields(fields: {
  id?: string;
  categoryId?: string;
  name?: string;
  shortDescription?: string;
  description?: string;
  price?: string | number;
  imageUrls?: string[];
  published?: string | boolean | null;
  available?: string | boolean | null;
  featured?: string | boolean | null;
}): Promise<SaveProductActionResult> {
  if (!hasSupabaseAdminConfig()) {
    return {
      status: "error",
      message: "Supabase admin write access is not configured yet.",
    };
  }

  const id = String(fields.id || "").trim();
  const categoryId = String(fields.categoryId || "").trim();
  const name = String(fields.name || "").trim();
  const shortDescription = String(fields.shortDescription || "").trim();
  const description = String(fields.description || "").trim();
  const price = Number(String(fields.price || "0").trim());
  const imageUrls = (fields.imageUrls || []).map((image) => image.trim()).filter(Boolean).slice(0, 5);
  const published = parseCheckboxValue(fields.published);
  const available = parseCheckboxValue(fields.available);
  const featured = parseCheckboxValue(fields.featured);

  if (!name || !categoryId || !categories.find((item) => item.id === categoryId)) {
    return {
      status: "error",
      message: "Please add a product name and a valid category.",
    };
  }

  const baseSlug = slugify(name);
  const supabase = await createSupabaseAdminClient();

  try {
    const slug = await resolveUniqueProductSlug(
      supabase,
      baseSlug,
      id || undefined,
    );

    const payload = {
      slug,
      category_id: categoryId,
      name,
      price: Number.isFinite(price) ? price : 0,
      description,
      short_description: shortDescription || description,
      image_urls: imageUrls,
      is_published: published,
      is_available: available,
      is_featured: featured,
    };

    if (id) {
      const { error } = await supabase.from("products").update(payload).eq("id", id);
      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        throw error;
      }
    }

    revalidateProductPaths(slug);

    return {
      status: "success",
      message: id ? "Product changes saved successfully." : "New product created successfully.",
      slug,
      created: !id,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to save the product right now.",
      slug: baseSlug,
      created: false,
    };
  }
}

export async function saveProductFromFormData(
  formData: FormData,
): Promise<SaveProductActionResult> {
  const imageUrls = [1, 2, 3, 4, 5]
    .map((index) => String(formData.get(`image_${index}`) || "").trim())
    .filter(Boolean)
    .slice(0, 5);

  return saveProductFromFields({
    id: String(formData.get("id") || ""),
    categoryId: String(formData.get("categoryId") || ""),
    name: String(formData.get("name") || ""),
    shortDescription: String(formData.get("shortDescription") || ""),
    description: String(formData.get("description") || ""),
    price: String(formData.get("price") || "0"),
    imageUrls,
    published: formData.get("published") === "on",
    available: formData.get("available") === "on",
    featured: formData.get("featured") === "on",
  });
}

export async function deleteProductById(fields: {
  id?: string;
  slug?: string;
}): Promise<DeleteProductActionResult> {
  if (!hasSupabaseAdminConfig()) {
    return {
      status: "error",
      message: "Supabase admin write access is not configured yet.",
      deleted: false,
    };
  }

  const id = String(fields.id || "").trim();
  const slug = String(fields.slug || "").trim();

  if (!id) {
    return {
      status: "error",
      message: "Missing product id for deletion.",
      slug,
      deleted: false,
    };
  }

  const supabase = await createSupabaseAdminClient();

  try {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      throw error;
    }

    if (slug) {
      revalidateProductPaths(slug);
    } else {
      revalidateTag(publicCatalogTag, "max");
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/admin");
      revalidatePath("/admin/products");
    }

    return {
      status: "success",
      message: "Product deleted successfully.",
      slug,
      deleted: true,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete the product right now.",
      slug,
      deleted: false,
    };
  }
}
