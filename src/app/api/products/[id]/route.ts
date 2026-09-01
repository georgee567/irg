import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeProduct } from "@/lib/serialize";

// GET /api/products/[id]
export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
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

    return NextResponse.json({ product: serializeProduct(product) });
  } catch (error) {
    console.error("Get product error:", error);

    return NextResponse.json(
      { error: "Unable to fetch product." },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id]
export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
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
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const {
      name,
      slug,
      description,
      price,
      images,
      featured,
      categoryId,
    } = body;

    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A product with this slug already exists." },
          { status: 409 }
        );
      }
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found." },
          { status: 404 }
        );
      }
    }

    if (price !== undefined) {
      const numericPrice = Number(price);

      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        return NextResponse.json(
          { error: "Invalid product price." },
          { status: 400 }
        );
      }
    }

    if (images !== undefined && !Array.isArray(images)) {
      return NextResponse.json(
        { error: "images must be an array." },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },

      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(images !== undefined && { images }),
        ...(featured !== undefined && {
          featured: Boolean(featured),
        }),
        ...(categoryId !== undefined && { categoryId }),
      },

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
    console.error("Update product error:", error);

    return NextResponse.json(
      { error: "Unable to update product." },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
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
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return NextResponse.json(
      { error: "Unable to delete product." },
      { status: 500 }
    );
  }
}