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

// POST /api/cart/items
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

    const { variantId, quantity = 1 } = body;

    if (!variantId) {
      return NextResponse.json(
        { error: "variantId is required." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json(
        { error: "Quantity must be a positive integer." },
        { status: 400 }
      );
    }

    const variant = await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },
      include: {
        product: true,
      },
    });

    if (!variant) {
      return NextResponse.json(
        { error: "Product variant not found." },
        { status: 404 }
      );
    }

    if (variant.stock < quantity) {
      return NextResponse.json(
        {
          error: `Only ${variant.stock} item(s) are available in stock.`,
        },
        { status: 409 }
      );
    }

    let cart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > variant.stock) {
        return NextResponse.json(
          {
            error: `Cannot add ${quantity} more. Only ${variant.stock - existingItem.quantity} additional item(s) are available.`,
          },
          { status: 409 }
        );
      }

      const updatedItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      });

      return NextResponse.json({
        message: "Cart item quantity updated.",
        item: updatedItem,
      });
    }

    const item = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity,
      },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Item added to cart.",
        item,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add to cart error:", error);

    return NextResponse.json(
      { error: "Unable to add item to cart." },
      { status: 500 }
    );
  }
}
