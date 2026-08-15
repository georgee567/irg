import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id: productId } = await context.params;

    const body = await request.json();

    const {
      size,
      color,
      price,
      stock,
    } = body;

    if (
      typeof size !== "string" ||
      !size.trim() ||
      typeof color !== "string" ||
      !color.trim() ||
      price === undefined ||
      stock === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "Size, color, price and stock are required.",
        },
        { status: 400 }
      );
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return NextResponse.json(
        {
          error: "Price must be a valid non-negative number.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      return NextResponse.json(
        {
          error: "Stock must be a non-negative integer.",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    const existingVariant =
      await prisma.productVariant.findFirst({
        where: {
          productId,
          size: size.trim(),
          color: color.trim(),
        },
      });

    if (existingVariant) {
      return NextResponse.json(
        {
          error:
            "A variant with this size and color already exists.",
        },
        { status: 409 }
      );
    }

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        size: size.trim(),
        color: color.trim(),
        price: numericPrice,
        stock: numericStock,
      },
    });

    return NextResponse.json(
      {
        message:
          "Product variant created successfully.",
        variant,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create variant error:", error);

    return NextResponse.json(
      {
        error:
          "Unable to create product variant.",
      },
      { status: 500 }
    );
  }
}