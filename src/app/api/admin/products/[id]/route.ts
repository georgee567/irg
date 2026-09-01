import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
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

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product,
    });
  } catch (error) {
    console.error("Get admin product error:", error);

    return NextResponse.json(
      { error: "Unable to fetch product." },
      { status: 500 }
    );
  }
}

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

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const allowedFields = [
      "name",
      "description",
      "slug",
      "images",
      "featured",
      "price",
      "categoryId",
    ] as const;

    const data: {
      name?: string;
      description?: string;
      slug?: string;
      images?: string[];
      featured?: boolean;
      price?: number;
      categoryId?: string;
    } = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "images") {
          if (!Array.isArray(body[field])) {
            return NextResponse.json(
              { error: "images must be an array of strings." },
              { status: 400 }
            );
          }
          data.images = body[field];
          continue;
        }

        if (field === "featured") {
          data.featured = Boolean(body[field]);
          continue;
        }

        if (field === "price") {
          const numericPrice = Number(body[field]);
          if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            return NextResponse.json(
              { error: "Invalid product price." },
              { status: 400 }
            );
          }
          data.price = numericPrice;
          continue;
        }

        if (typeof body[field] !== "string") {
          return NextResponse.json(
            { error: `${field} must be a string.` },
            { status: 400 }
          );
        }

        data[field] = body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update." },
        { status: 400 }
      );
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: {
          id: data.categoryId,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found." },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data,
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Admin product update error:", error);

    return NextResponse.json(
      { error: "Unable to update product." },
      { status: 500 }
    );
  }
}

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

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        variants: true,
        orderItems: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    if (product.orderItems.length > 0) {
      return NextResponse.json(
        {
          error:
            "This product cannot be deleted because it is referenced by an existing order.",
        },
        { status: 409 }
      );
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Admin product delete error:", error);

    return NextResponse.json(
      { error: "Unable to delete product." },
      { status: 500 }
    );
  }
}