import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body: unknown = await request.json();
    const status =
      typeof body === "object" && body !== null && "status" in body
        ? body.status
        : undefined;
    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json({ error: "Choose APPROVED or REJECTED." }, { status: 400 });
    }

    const { id } = await context.params;
    const result = await prisma.productReview.updateMany({
      where: { id },
      data: { status },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }
    return NextResponse.json({ message: `Review ${status.toLowerCase()}.` });
  } catch (error) {
    console.error("Update admin review error:", error);
    return NextResponse.json({ error: "Unable to update review." }, { status: 500 });
  }
}
