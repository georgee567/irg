import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";

type VariantInput = { size?: unknown; color?: unknown; price?: unknown; stock?: unknown };

function productResponse(product: any) {
  return serializeProduct(product);
}

function validateVariants(input: unknown) {
  if (!Array.isArray(input)) return "Variants must be an array.";
  for (const variant of input as VariantInput[]) {
    const price = Number(variant.price);
    const stock = Number(variant.stock ?? 0);
    if (typeof variant.size !== "string" || !variant.size.trim() || typeof variant.color !== "string" || !variant.color.trim() || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) return "Each variant needs a size, color, non-negative price, and non-negative integer stock.";
  }
  return null;
}

async function readProductData(request: Request) {
  const body = await request.json();
  const { name, slug, description, price, images = [], featured = false, categoryId, variants = [] } = body;
  if ([name, slug, description, categoryId].some((value) => typeof value !== "string" || !value.trim()) || price === undefined) return { error: "Name, slug, description, price, and category are required." };
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) return { error: "Invalid product price." };
  if (!Array.isArray(images) || images.some((image) => typeof image !== "string" || !image.trim())) return { error: "Images must be an array of paths." };
  const variantError = validateVariants(variants);
  if (variantError) return { error: variantError };
  return { data: { name: name.trim(), slug: slug.trim(), description: description.trim(), price: numericPrice, images: images.map((image: string) => image.trim()), featured: Boolean(featured), categoryId, variants: (variants as VariantInput[]).map((variant) => ({ id: randomUUID(), updatedAt: new Date(), size: (variant.size as string).trim(), color: (variant.color as string).trim(), price: Number(variant.price), stock: Number(variant.stock ?? 0) })) } };
}

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  try {
    const products = await prisma.product.findMany({ include: { Category: true, ProductVariant: true }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ products: products.map(productResponse), count: products.length });
  } catch (error) {
    console.error("Get admin products error:", error);
    return NextResponse.json({ error: "Unable to fetch products." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;
  try {
    const result = await readProductData(request);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
    const category = await prisma.category.findUnique({ where: { id: result.data.categoryId } });
    if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
    const existing = await prisma.product.findUnique({ where: { slug: result.data.slug } });
    if (existing) return NextResponse.json({ error: "A product with this slug already exists." }, { status: 409 });
    const product = await prisma.product.create({ data: { id: randomUUID(), updatedAt: new Date(), name: result.data.name, slug: result.data.slug, description: result.data.description, price: result.data.price, images: result.data.images, featured: result.data.featured, categoryId: result.data.categoryId, ProductVariant: { create: result.data.variants } }, include: { Category: true, ProductVariant: true } });
    return NextResponse.json({ message: "Product created successfully.", product: productResponse(product) }, { status: 201 });
  } catch (error) {
    console.error("Create admin product error:", error);
    return NextResponse.json({ error: "Unable to create product." }, { status: 500 });
  }
}

