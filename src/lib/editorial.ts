import type { EditorialType } from "@/generated/prisma/client";

const editorialTypes = new Set<EditorialType>(["LOOKBOOK", "JOURNAL"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseEditorialEntry(value: unknown) {
  if (!isRecord(value)) return null;
  const type = value.type;
  const title = typeof value.title === "string" ? value.title.trim() : "";
  const slug = typeof value.slug === "string" ? value.slug.trim().toLowerCase() : "";
  const summary = typeof value.summary === "string" ? value.summary.trim() : "";
  const body = typeof value.body === "string" ? value.body.trim() : "";
  const imageUrl = typeof value.imageUrl === "string" ? value.imageUrl.trim() : "";
  const imageAlt = typeof value.imageAlt === "string" ? value.imageAlt.trim() : "";
  const productId =
    typeof value.productId === "string" && value.productId.trim()
      ? value.productId.trim()
      : null;
  const published = value.published;

  if (
    typeof type !== "string" ||
    !editorialTypes.has(type as EditorialType) ||
    !title ||
    title.length > 180 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !summary ||
    summary.length > 600 ||
    !body ||
    body.length > 30000 ||
    imageUrl.length > 2048 ||
    imageAlt.length > 250 ||
    (imageUrl !== "" &&
      !(
        (imageUrl.startsWith("/") && !imageUrl.startsWith("//")) ||
        /^https:\/\/[a-z0-9.-]+\.public\.blob\.vercel-storage\.com(?:\/|$)/i.test(imageUrl)
      )) ||
    typeof published !== "boolean" ||
    (productId !== null && type !== "LOOKBOOK")
  ) {
    return null;
  }

  return {
    type: type as EditorialType,
    title,
    slug,
    summary,
    body,
    imageUrl,
    imageAlt,
    productId,
    published,
  };
}
