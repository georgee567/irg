import crypto from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeProduct } from "@/lib/serialize";

// GET /api/wishlist
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        WishlistItem: {
          include: {
            Product: {
              include: {
                Category: true,
                ProductVariant: true,
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          updatedAt: new Date(),
        },
        include: {
          WishlistItem: {
            include: {
              Product: {
                include: {
                  Category: true,
                  ProductVariant: true,
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({
      wishlist: {
        ...wishlist,
        items: wishlist.WishlistItem.map(item => ({
          ...item,
          product: serializeProduct(item.Product),
        })),
      },
      itemCount: wishlist.WishlistItem.length,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    return NextResponse.json(
      { error: "Unable to fetch wishlist." },
      { status: 500 }
    );
  }
}