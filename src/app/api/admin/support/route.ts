import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const requests = await prisma.supportRequest.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
    });
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Load support requests error:", error);
    return NextResponse.json({ error: "Unable to load support requests." }, { status: 500 });
  }
}
