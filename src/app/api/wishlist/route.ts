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
        items: {
          include: {
            product: {
              include: {
                category: true,
                variants: true,
              },
            },
          },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId: user.id,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                  variants: true,
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
        items: wishlist.items.map(item => ({
          ...item,
          product: serializeProduct(item.product),
        })),
      },
      itemCount: wishlist.items.length,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    return NextResponse.json(
      { error: "Unable to fetch wishlist." },
      { status: 500 }
    );
  }
}