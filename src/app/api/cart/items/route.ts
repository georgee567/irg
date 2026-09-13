import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeDecimal } from "@/lib/serialize";

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
        Product: true,
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
          id: randomUUID(),
          userId: user.id,
          updatedAt: new Date(),
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
          updatedAt: new Date(),
        },
        include: {
          ProductVariant: {
            include: {
              Product: true,
            },
          },
        },
      });

      return NextResponse.json({
        message: "Cart item quantity updated.",
        item: {
          ...updatedItem,
          ProductVariant: {
            ...updatedItem.ProductVariant,
            price: serializeDecimal(updatedItem.ProductVariant.price),
          },
        },
      });
    }

    const item = await prisma.cartItem.create({
      data: {
        id: randomUUID(),
        cartId: cart.id,
        variantId,
        quantity,
        updatedAt: new Date(),
      },
      include: {
        ProductVariant: {
          include: {
            Product: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Item added to cart.",
        item: {
          ...item,
          ProductVariant: {
            ...item.ProductVariant,
            price: serializeDecimal(item.ProductVariant.price),
          },
        },
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
