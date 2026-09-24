import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";

type ProductRecord = Record<string, unknown> & {
  price?: unknown;
  Category?: unknown;
  category?: unknown;
  ProductVariant?: unknown[];
  variants?: unknown[];
};

function productResponse(product: ProductRecord) {
  return serializeProduct(product);
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await context.params;
  const product = await prisma.product.findUnique({ where: { id }, include: { Category: true, ProductVariant: true } });
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ product: productResponse(product) });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await context.params;
  try {
    const body = await request.json();
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    const numericPrice = Number(body.price);
    if (typeof body.name !== "string" || !body.name.trim() || typeof body.description !== "string" || !body.description.trim() || typeof body.slug !== "string" || !body.slug.trim() || !Number.isFinite(numericPrice) || numericPrice < 0 || typeof body.categoryId !== "string") return NextResponse.json({ error: "Name, slug, description, price, and category are required." }, { status: 400 });
    if (!Array.isArray(body.images) || body.images.some((image: unknown) => typeof image !== "string" || !image.trim())) return NextResponse.json({ error: "Images must be an array of paths." }, { status: 400 });
    if (!Array.isArray(body.variants)) return NextResponse.json({ error: "Variants must be an array." }, { status: 400 });
    for (const variant of body.variants) {
      const variantPrice = Number(variant.price);
      const stock = Number(variant.stock ?? 0);
      if (typeof variant.size !== "string" || !variant.size.trim() || typeof variant.color !== "string" || !variant.color.trim() || !Number.isFinite(variantPrice) || variantPrice < 0 || !Number.isInteger(stock) || stock < 0) return NextResponse.json({ error: "Each variant needs valid size, color, price, and stock." }, { status: 400 });
    }
    const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
    if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
    const slugExists = await prisma.product.findFirst({ where: { slug: body.slug.trim(), NOT: { id } } });
    if (slugExists) return NextResponse.json({ error: "A product with this slug already exists." }, { status: 409 });
    const product = await prisma.$transaction(async (transaction) => {
      await transaction.productVariant.deleteMany({ where: { productId: id } });
      return transaction.product.update({
        where: { id },
        data: {
          name: body.name.trim(),
          slug: body.slug.trim(),
          description: body.description.trim(),
          price: numericPrice,
          images: body.images.map((image: string) => image.trim()),
          featured: Boolean(body.featured),
          categoryId: body.categoryId,
          updatedAt: new Date(),
          ProductVariant: {
            create: body.variants.map((variant: { size?: unknown; color?: unknown; price?: unknown; stock?: unknown }) => ({
              id: randomUUID(),
              updatedAt: new Date(),
              size: String(variant.size).trim(),
              color: String(variant.color).trim(),
              price: Number(variant.price),
              stock: Number(variant.stock ?? 0),
            })),
          },
        },
        include: { Category: true, ProductVariant: true },
      });
    });
    return NextResponse.json({ message: "Product updated successfully.", product: productResponse(product) });
  } catch (error) {
    console.error("Update admin product error:", error);
    return NextResponse.json({ error: "Unable to update product." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;
  const { id } = await context.params;
  const product = await prisma.product.findUnique({ where: { id }, include: { OrderItem: true } });
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  if (product.OrderItem.length) return NextResponse.json({ error: "This product cannot be deleted because it is referenced by an existing order." }, { status: 409 });
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ message: "Product deleted successfully." });
}
