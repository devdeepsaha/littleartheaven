export const productImagesBucket =
  process.env.SUPABASE_PRODUCT_IMAGES_BUCKET || "product-images";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

function createPublicBucketUrl(pathname: string) {
  if (!supabaseUrl) {
    return pathname;
  }

  const normalizedBase = supabaseUrl.replace(/\/+$/, "");
  const normalizedPath = pathname.replace(/^\/+/, "");
  return `${normalizedBase}/storage/v1/object/public/${productImagesBucket}/${normalizedPath}`;
}

export function resolveStoredAssetUrl(url: string) {
  if (!url) {
    return url;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/assets/products/")) {
    return createPublicBucketUrl(`products/${url.split("/").pop()}`);
  }

  if (url.startsWith("/assets/brand/")) {
    return createPublicBucketUrl(`brand/${url.split("/").pop()}`);
  }

  return url;
}
