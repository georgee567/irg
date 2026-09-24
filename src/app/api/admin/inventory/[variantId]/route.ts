import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ variantId: string }> }
) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const { variantId } = await context.params;
    const body = await request.json();

    const stock = body.stock;

    if (
      typeof stock !== "number" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Stock must be a non-negative integer.",
        },
        { status: 400 }
      );
    }

    const variant =
      await prisma.productVariant.findUnique({
        where: {
          id: variantId,
        },
      });

    if (!variant) {
      return NextResponse.json(
        { error: "Product variant not found." },
        { status: 404 }
      );
    }

    const updatedVariant =
      await prisma.productVariant.update({
        where: {
          id: variantId,
        },
        data: {
          stock,
        },
      });

    return NextResponse.json({
      message: "Inventory updated successfully.",
      variant: updatedVariant,
    });
  } catch (error) {
    console.error(
      "Update inventory error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to update inventory." },
      { status: 500 }
    );
  }
}
