import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const reviews = await prisma.productReview.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
      select: {
        id: true,
        rating: true,
        title: true,
        body: true,
        status: true,
        createdAt: true,
        User: { select: { name: true, email: true } },
        Product: { select: { name: true } },
      },
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Load admin reviews error:", error);
    return NextResponse.json({ error: "Unable to load customer reviews." }, { status: 500 });
  }
}
