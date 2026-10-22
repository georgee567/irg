import { NextResponse } from "next/server";

import type { EditorialType } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/admin";
import { parseEditorialEntry } from "@/lib/editorial";
import { prisma } from "@/lib/prisma";

const editorialTypes = new Set<EditorialType>(["LOOKBOOK", "JOURNAL"]);

export async function GET(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const type = new URL(request.url).searchParams.get("type");
    if (type && !editorialTypes.has(type as EditorialType)) {
      return NextResponse.json({ error: "Invalid editorial type." }, { status: 400 });
    }
    const entries = await prisma.editorialEntry.findMany({
      where: type ? { type: type as EditorialType } : undefined,
      orderBy: [{ updatedAt: "desc" }],
      include: { Product: { select: { id: true, name: true, slug: true } } },
    });
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Load admin editorial entries error:", error);
    return NextResponse.json({ error: "Unable to load editorial entries." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
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

    const created = await prisma.editorialEntry.create({
      data: {
        ...entry,
        publishedAt: entry.published ? new Date() : null,
      },
    });
    return NextResponse.json({ entry: created }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "An entry with this type and slug already exists." }, { status: 409 });
    }
    console.error("Create editorial entry error:", error);
    return NextResponse.json({ error: "Unable to create editorial entry." }, { status: 500 });
  }
}
