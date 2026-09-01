import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// PATCH /api/cart/items/[id]
export async function PATCH(
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
    const body = await request.json();
    const { quantity } = body;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be a positive integer." },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId: user.id,
        },
      },
      include: {
        variant: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found." },
        { status: 404 }
      );
    }

    if (quantity > cartItem.variant.stock) {
      return NextResponse.json(
        {
          error: `Only ${cartItem.variant.stock} item(s) are available in stock.`,
        },
        { status: 409 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
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

    return NextResponse.json({
      message: "Cart item updated successfully.",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    return NextResponse.json(
      { error: "Unable to update cart item." },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/items/[id]
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

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId: user.id,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found." },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return NextResponse.json({
      message: "Item removed from cart.",
    });
  } catch (error) {
    console.error("Delete cart item error:", error);

    return NextResponse.json(
      { error: "Unable to remove cart item." },
      { status: 500 }
    );
  }
}