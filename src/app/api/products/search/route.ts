import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";

// GET /api/products/search?q=query
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim().toLowerCase();

    if (!query) {
      return NextResponse.json(
        { products: [] }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        category: true,
        variants: true,
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
