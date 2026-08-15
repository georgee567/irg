import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id } = await context.params;
    const body = await request.json();

    const existingVariant =
      await prisma.productVariant.findUnique({
        where: { id },
      });

    if (!existingVariant) {
      return NextResponse.json(
        { error: "Product variant not found." },
        { status: 404 }
      );
    }

    const { size, color, price, stock } = body;

    if (size !== undefined && typeof size !== "string") {
      return NextResponse.json(
        { error: "Invalid size." },
        { status: 400 }
      );
    }

    if (color !== undefined && typeof color !== "string") {
      return NextResponse.json(
        { error: "Invalid color." },
        { status: 400 }
      );
    }

    if (price !== undefined) {
      const numericPrice = Number(price);

      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        return NextResponse.json(
          { error: "Invalid price." },
          { status: 400 }
        );
      }
    }

    if (stock !== undefined) {
      const numericStock = Number(stock);

      if (!Number.isInteger(numericStock) || numericStock < 0) {
        return NextResponse.json(
          { error: "Invalid stock." },
          { status: 400 }
        );
      }
    }

    const updatedVariant =
      await prisma.productVariant.update({
        where: { id },
        data: {
          ...(size !== undefined && {
            size: size.trim(),
          }),
          ...(color !== undefined && {
            color: color.trim(),
          }),
          ...(price !== undefined && {
            price: Number(price),
          }),
          ...(stock !== undefined && {
            stock: Number(stock),
          }),
        },
      });

    return NextResponse.json({
      message: "Product variant updated successfully.",
      variant: updatedVariant,
    });
  } catch (error) {
    console.error("Update variant error:", error);

    return NextResponse.json(
      { error: "Unable to update product variant." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id } = await context.params;

    const variant = await prisma.productVariant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            cartItems: true,
            orderItems: true,
          },
        },
      },
    });

    if (!variant) {
      return NextResponse.json(
        { error: "Product variant not found." },
        { status: 404 }
      );
    }

    if (
      variant._count.cartItems > 0 ||
      variant._count.orderItems > 0
    ) {
      return NextResponse.json(
        {
          error:
            "This variant cannot be deleted because it is referenced by a cart or order.",
        },
        { status: 409 }
      );
    }

    await prisma.productVariant.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Product variant deleted successfully.",
      variantId: id,
    });
  } catch (error) {
    console.error("Delete variant error:", error);

    return NextResponse.json(
      { error: "Unable to delete product variant." },
      { status: 500 }
    );
  }
}