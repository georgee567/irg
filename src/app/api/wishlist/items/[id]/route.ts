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

// DELETE /api/wishlist/items/[id]
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const item = await prisma.wishlistItem.findFirst({
      where: {
        id,
        wishlist: {
          userId: user.id,
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Wishlist item not found." },
        { status: 404 }
      );
    }

    await prisma.wishlistItem.delete({
      where: {
        id: item.id,
      },
    });

    return NextResponse.json({
      message: "Product removed from wishlist.",
    });
  } catch (error) {
    console.error("Remove wishlist item error:", error);

    return NextResponse.json(
      { error: "Unable to remove wishlist item." },
      { status: 500 }
    );
  }
}