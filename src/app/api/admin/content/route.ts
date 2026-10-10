import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { mergeSiteContent, siteContentDefaults, type SitePage } from "@/lib/site-content";

const pages = Object.keys(siteContentDefaults) as SitePage[];
const maxContentLength = 100_000;

function isPage(value: unknown): value is SitePage {
  return typeof value === "string" && pages.includes(value as SitePage);
}

function isContent(value: unknown): value is Record<string, string> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const entries = Object.entries(value);
  return entries.length <= 100 && entries.every(
    ([key, item]) => key.length <= 100 && typeof item === "string" && item.length <= maxContentLength,
  );
}

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const saved = await prisma.siteContent.findMany();
    const savedByPage = new Map(saved.map((item) => [item.page, item.content]));

    return NextResponse.json({
      pages: pages.map((page) => ({
        page,
        defaults: siteContentDefaults[page],
        content: mergeSiteContent(page, savedByPage.get(page)),
      })),
    });
  } catch (error) {
    console.error("Admin site content load error:", error);
    return NextResponse.json({ error: "Unable to load site content." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const body: unknown = await request.json();
    if (
      typeof body !== "object" ||
      body === null ||
      !("page" in body) ||
      !("content" in body) ||
      !isPage(body.page) ||
      !isContent(body.content)
    ) {
      return NextResponse.json({ error: "A valid page and content object are required." }, { status: 400 });
    }

    const allowedKeys = new Set(Object.keys(siteContentDefaults[body.page]));
    if (Object.keys(body.content).some((key) => !allowedKeys.has(key))) {
      return NextResponse.json({ error: "Content contains unsupported fields." }, { status: 400 });
    }

    const encodedContent = JSON.stringify(body.content);
    if (encodedContent.length > maxContentLength) {
      return NextResponse.json({ error: "Page content must be smaller than 100 KB." }, { status: 413 });
    }

    await prisma.siteContent.upsert({
      where: { page: body.page },
      create: { page: body.page, content: body.content },
      update: { content: body.content },
    });

    return NextResponse.json({ message: "Site content saved." });
  } catch (error) {
    console.error("Admin site content save error:", error);
    return NextResponse.json({ error: "Unable to save site content." }, { status: 500 });
  }
}
