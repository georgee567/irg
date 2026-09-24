import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const variants = await prisma.productVariant.findMany({
      include: { Product: { select: { id: true, name: true, images: true } } },
      orderBy: [{ stock: "asc" }, { Product: { name: "asc" } }],
    });
    return NextResponse.json({ variants: variants.map((variant) => ({ ...variant, price: Number(variant.price) })) });
  } catch (error) {
    console.error("Get admin inventory error:", error);
    return NextResponse.json({ error: "Unable to fetch inventory." }, { status: 500 });
  }
}
