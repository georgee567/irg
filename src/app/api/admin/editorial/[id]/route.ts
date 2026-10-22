import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { parseEditorialEntry } from "@/lib/editorial";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const { id } = await context.params;
    const entry = parseEditorialEntry(await request.json());
    if (!entry) {
      return NextResponse.json({ error: "Enter valid editorial content and fields." }, { status: 400 });
    }

    if (entry.productId) {
      const product = await prisma.product.findUnique({
        where: { id: entry.productId },
        select: { id: true },
      });
      if (!product) return NextResponse.json({ error: "Linked product not found." }, { status: 404 });
    }

    const existing = await prisma.editorialEntry.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Editorial entry not found." }, { status: 404 });

    const updated = await prisma.editorialEntry.update({
      where: { id },
      data: {
        ...entry,
        publishedAt: entry.published
          ? existing.publishedAt ?? new Date()
          : null,
      },
    });
    return NextResponse.json({ entry: updated });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "An entry with this type and slug already exists." }, { status: 409 });
    }
    console.error("Update editorial entry error:", error);
    return NextResponse.json({ error: "Unable to update editorial entry." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const { id } = await context.params;
    const deleted = await prisma.editorialEntry.deleteMany({ where: { id } });
    if (deleted.count === 0) {
      return NextResponse.json({ error: "Editorial entry not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Editorial entry deleted." });
  } catch (error) {
    console.error("Delete editorial entry error:", error);
    return NextResponse.json({ error: "Unable to delete editorial entry." }, { status: 500 });
  }
}
