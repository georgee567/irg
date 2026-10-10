import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";

const allowedContentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Media storage is not configured." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("site-content/")) {
          throw new Error("Invalid content media path.");
        }

        return {
          allowedContentTypes,
          maximumSizeInBytes: 100 * 1024 * 1024,
          addRandomSuffix: false,
          tokenPayload: "site-content",
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Site content media upload token error:", error);
    return NextResponse.json({ error: "Unable to authorize media upload." }, { status: 400 });
  }
}
