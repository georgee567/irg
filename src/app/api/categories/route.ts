import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return NextResponse.json(
      { error: "Unable to fetch categories." },
      { status: 500 }
    );
  }
}

// POST /api/categories
export async function POST(request: Request) {
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

    const body = await request.json();

    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "name and slug are required." },
        { status: 400 }
      );
    }

    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category name or slug already exists." },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(
      {
        message: "Category created successfully.",
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create category error:", error);

    return NextResponse.json(
      { error: "Unable to create category." },
      { status: 500 }
    );
  }
}
