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

type VariantInput = { id?: unknown; size?: unknown; color?: unknown; price?: unknown; stock?: unknown };

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
    for (const variant of body.variants as VariantInput[]) {
      const variantPrice = Number(variant.price);
      const stock = Number(variant.stock ?? 0);
      if ((variant.id !== undefined && typeof variant.id !== "string") || typeof variant.size !== "string" || !variant.size.trim() || typeof variant.color !== "string" || !variant.color.trim() || !Number.isFinite(variantPrice) || variantPrice < 0 || !Number.isInteger(stock) || stock < 0) return NextResponse.json({ error: "Each variant needs valid size, color, price, and stock." }, { status: 400 });
    }
    const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
    if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
    const slugExists = await prisma.product.findFirst({ where: { slug: body.slug.trim(), NOT: { id } } });
    if (slugExists) return NextResponse.json({ error: "A product with this slug already exists." }, { status: 409 });
    const existingVariants = await prisma.productVariant.findMany({ where: { productId: id }, select: { id: true } });
    const existingVariantIds = new Set(existingVariants.map((variant) => variant.id));
    const submittedVariantIds = new Set<string>();
    const submittedVariantKeys = new Set<string>();
    for (const variant of body.variants as VariantInput[]) {
      const variantKey = `${String(variant.size).trim().toLowerCase()}\u0000${String(variant.color).trim().toLowerCase()}`;
      if (submittedVariantKeys.has(variantKey)) return NextResponse.json({ error: "A product cannot contain duplicate size and color variants." }, { status: 400 });
      submittedVariantKeys.add(variantKey);
      if (typeof variant.id === "string") {
        if (!existingVariantIds.has(variant.id) || submittedVariantIds.has(variant.id)) return NextResponse.json({ error: "One or more variants do not belong to this product." }, { status: 400 });
        submittedVariantIds.add(variant.id);
      }
    }
    const removedVariantIds = existingVariants.map((variant) => variant.id).filter((variantId) => !submittedVariantIds.has(variantId));
    if (removedVariantIds.length) {
      const referencedVariant = await prisma.productVariant.findFirst({
        where: { id: { in: removedVariantIds }, OR: [{ OrderItem: { some: {} } }, { CartItem: { some: {} } }] },
        select: { id: true },
      });
      if (referencedVariant) return NextResponse.json({ error: "A variant referenced by an order or cart cannot be removed. Update its stock instead." }, { status: 409 });
    }
    const product = await prisma.$transaction(async (transaction) => {
      const updatedProduct = await transaction.product.update({
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
        },
      });
      if (removedVariantIds.length) await transaction.productVariant.deleteMany({ where: { id: { in: removedVariantIds } } });
      for (const variant of body.variants as VariantInput[]) {
        if (typeof variant.id === "string") await transaction.productVariant.update({ where: { id: variant.id }, data: { size: `__pending_${variant.id}`, color: `__pending_${variant.id}`, updatedAt: new Date() } });
      }
      for (const variant of body.variants as VariantInput[]) {
        const data = { size: String(variant.size).trim(), color: String(variant.color).trim(), price: Number(variant.price), stock: Number(variant.stock ?? 0), updatedAt: new Date() };
        if (typeof variant.id === "string") await transaction.productVariant.update({ where: { id: variant.id }, data });
        else await transaction.productVariant.create({ data: { ...data, id: randomUUID(), productId: id } });
      }
      return transaction.product.findUniqueOrThrow({ where: { id: updatedProduct.id }, include: { Category: true, ProductVariant: true } });
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
