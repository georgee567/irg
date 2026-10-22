import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: productId } = await context.params;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const reviews = await prisma.productReview.findMany({
      where: { productId, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        title: true,
        body: true,
        createdAt: true,
        User: { select: { name: true } },
      },
    });

    return NextResponse.json({
      reviews: reviews.map((review) => {
        const [firstName, ...lastNames] = review.User.name.trim().split(/\s+/);
        const lastNameInitial = lastNames.at(-1)?.[0];
        return {
          id: review.id,
          rating: review.rating,
          title: review.title,
          body: review.body,
          createdAt: review.createdAt,
          customerName: firstName
            ? `${firstName}${lastNameInitial ? ` ${lastNameInitial}.` : ""}`
            : "IRG Customer",
        };
      }),
    });
  } catch (error) {
    console.error("Load product reviews error:", error);
    return NextResponse.json({ error: "Unable to load product reviews." }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in to submit a review." }, { status: 401 });
    }

    const { id: productId } = await context.params;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const body: unknown = await request.json();
    if (!isRecord(body)) {
      return NextResponse.json({ error: "A valid review is required." }, { status: 400 });
    }

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const reviewBody = typeof body.body === "string" ? body.body.trim() : "";
    const rating = body.rating;
    if (
      typeof rating !== "number" ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      !title ||
      title.length > 120 ||
      !reviewBody ||
      reviewBody.length > 2000
    ) {
      return NextResponse.json(
        { error: "Choose a rating from 1 to 5 and provide a title and review under the length limits." },
        { status: 400 },
      );
    }

    const verifiedOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        paymentStatus: "PAID",
        OrderItem: { some: { productId } },
      },
      select: { id: true },
    });
    if (!verifiedOrder) {
      return NextResponse.json(
        { error: "Reviews are available to customers with a paid order for this product." },
        { status: 403 },
      );
    }

    await prisma.productReview.create({
      data: { userId: user.id, productId, rating, title, body: reviewBody },
    });

    return NextResponse.json(
      { message: "Thank you. Your verified review is awaiting approval." },
      { status: 201 },
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "You have already submitted a review for this product." },
        { status: 409 },
      );
    }
    console.error("Create product review error:", error);
    return NextResponse.json({ error: "Unable to submit your review." }, { status: 500 });
  }
}
