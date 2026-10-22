import { NextResponse } from "next/server";

import { SupportRequestStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const statuses = new Set<SupportRequestStatus>(["NEW", "IN_PROGRESS", "RESOLVED"]);

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
    if (typeof status !== "string" || !statuses.has(status as SupportRequestStatus)) {
      return NextResponse.json(
        { error: "Choose NEW, IN_PROGRESS, or RESOLVED." },
        { status: 400 },
      );
    }

    const { id } = await context.params;
    const result = await prisma.supportRequest.updateMany({
      where: { id },
      data: { status: status as SupportRequestStatus },
    });
    if (result.count === 0) {
      return NextResponse.json({ error: "Support request not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Support request updated." });
  } catch (error) {
    console.error("Update support request error:", error);
    return NextResponse.json({ error: "Unable to update support request." }, { status: 500 });
  }
}
