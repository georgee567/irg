import { NextResponse } from "next/server";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

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
      wishlist,
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