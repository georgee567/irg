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

// GET /api/cart
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    let cart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Create the cart automatically if the user doesn't have one.
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    const subtotal = cart.items.reduce((total, item) => {
      return total + Number(item.variant.price) * item.quantity;
    }, 0);

    const itemCount = cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    return NextResponse.json({
      cart: {
        ...cart,
        subtotal,
        itemCount,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return NextResponse.json(
      { error: "Unable to fetch cart." },
      { status: 500 }
    );
  }
}

// DELETE /api/cart
export async function DELETE() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!cart) {
      return NextResponse.json({
        message: "Cart is already empty.",
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return NextResponse.json({
      message: "Cart cleared successfully.",
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    return NextResponse.json(
      { error: "Unable to clear cart." },
      { status: 500 }
    );
  }
}