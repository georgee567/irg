import crypto from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { serializeProduct } from "@/lib/serialize";

// GET /api/products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        Category: true,
        ProductVariant: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      products: products.map(serializeProduct),
    });
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      {
        error: "Unable to fetch products.",
      },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: Request) {
  try {
    // Check authentication
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        { status: 401 }
      );
    }

    // Check admin role
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Admin access required.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      name,
      slug,
      description,
      price,
      images = [],
      featured = false,
      categoryId,
      variants = [],
    } = body;

    // Validate required fields
    if (
      !name ||
      !slug ||
      !description ||
      price === undefined ||
      !categoryId
    ) {
      return NextResponse.json(
        {
          error:
            "name, slug, description, price and categoryId are required.",
        },
        { status: 400 }
      );
    }

    // Validate price
    const productPrice = Number(price);

    if (!Number.isFinite(productPrice) || productPrice < 0) {
      return NextResponse.json(
        {
          error: "Invalid product price.",
        },
        { status: 400 }
      );
    }

    // Validate images
    if (!Array.isArray(images)) {
      return NextResponse.json(
        {
          error: "images must be an array.",
        },
        { status: 400 }
      );
    }

    // Check category exists
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found.",
        },
        { status: 404 }
      );
    }

    // Check slug isn't already used
    const existingProduct = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          error: "A product with this slug already exists.",
        },
        { status: 409 }
      );
    }

    // Validate variants
    if (!Array.isArray(variants)) {
      return NextResponse.json(
        {
          error: "variants must be an array.",
        },
        { status: 400 }
      );
    }

    for (const variant of variants) {
      if (
        !variant.size ||
        !variant.color ||
        variant.price === undefined
      ) {
        return NextResponse.json(
          {
            error:
              "Each variant requires size, color and price.",
          },
          { status: 400 }
        );
      }

      const variantPrice = Number(variant.price);
      const stock = Number(variant.stock ?? 0);

      if (!Number.isFinite(variantPrice) || variantPrice < 0) {
        return NextResponse.json(
          {
            error: "Invalid variant price.",
          },
          { status: 400 }
        );
      }

      if (!Number.isInteger(stock) || stock < 0) {
        return NextResponse.json(
          {
            error: "Variant stock must be a non-negative integer.",
          },
          { status: 400 }
        );
      }
    }

    // Create product and variants
    const product = await prisma.product.create({
      data: {
        id: crypto.randomUUID(),
        updatedAt: new Date(),
        name,
        slug,
        description,
        price: productPrice,
        images,
        featured: Boolean(featured),

        Category: {
          connect: {
            id: categoryId,
          },
        },

        ProductVariant: {
          create: variants.map(
            (variant: {
              size: string;
              color: string;
              price: number | string;
              stock?: number;
            }) => ({
              id: crypto.randomUUID(),
              size: variant.size,
              color: variant.color,
              price: Number(variant.price),
              stock: Number(variant.stock ?? 0),
              updatedAt: new Date(),
            })
          ),
        },
      },

      include: {
        Category: true,
        ProductVariant: true,
      },
    });

    return NextResponse.json(
      {
        message: "Product created successfully.",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      {
        error: "Unable to create product.",
      },
      { status: 500 }
    );
  }
}