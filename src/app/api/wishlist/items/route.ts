import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeProduct } from "@/lib/serialize";

// POST /api/wishlist/items
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        Category: true,
        ProductVariant: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          id: randomUUID(),
          userId: user.id,
          updatedAt: new Date(),
        },
      });
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        {
          message: "Product is already in your wishlist.",
          item: existingItem,
        },
        { status: 200 }
      );
    }

    const item = await prisma.wishlistItem.create({
      data: {
        id: randomUUID(),
        wishlistId: wishlist.id,
        productId,
      },
      include: {
        Product: {
          include: {
            Category: true,
            ProductVariant: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Product added to wishlist.",
        item: {
          ...item,
          product: serializeProduct(item.Product),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add wishlist item error:", error);

    return NextResponse.json(
      { error: "Unable to add product to wishlist." },
      { status: 500 }
    );
  }
}