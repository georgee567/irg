import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";

// GET /api/products/search?q=query
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim().toLowerCase();
    const requestedCategory = searchParams.get("category")?.trim();

    if (!query) {
      return NextResponse.json(
        { products: [] }
      );
    }

    const category = requestedCategory
      ? await prisma.category.findFirst({
          where: {
            OR: [
              { id: requestedCategory },
              { slug: requestedCategory.toLowerCase() },
              { name: { equals: requestedCategory, mode: "insensitive" } },
            ],
          },
          select: { id: true },
        })
      : null;

    if (requestedCategory && !category) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: {
        ...(category ? { categoryId: category.id } : {}),
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          {
            Category: {
              name: { contains: query, mode: "insensitive" },
            },
          },
        ],
      },
      include: {
        Category: true,
        ProductVariant: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json({
      products: products.map(serializeProduct),
    });
  } catch (error) {
    console.error("Search products error:", error);

    return NextResponse.json(
      { error: "Unable to search products." },
      { status: 500 }
    );
  }
}
