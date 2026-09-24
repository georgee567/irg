import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const maxFileSize = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Product image storage is not configured." }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);
    if (!files.length) return NextResponse.json({ error: "Select at least one image." }, { status: 400 });
    if (files.some((file) => !allowedTypes.has(file.type))) return NextResponse.json({ error: "Only JPEG, PNG, WebP, and AVIF images are accepted." }, { status: 400 });
    if (files.some((file) => file.size === 0 || file.size > maxFileSize)) return NextResponse.json({ error: "Each image must be between 1 byte and 5 MB." }, { status: 400 });

    const uploads = await Promise.all(files.map(async (file) => {
      const extension = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
      return put(`products/${randomUUID()}.${extension}`, file, { access: "public", addRandomSuffix: false, contentType: file.type });
    }));
    return NextResponse.json({ urls: uploads.map((upload) => upload.url) }, { status: 201 });
  } catch (error) {
    console.error("Product image upload error:", error);
    return NextResponse.json({ error: "Unable to upload product image." }, { status: 500 });
  }
}
