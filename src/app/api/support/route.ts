import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!isRecord(body)) {
      return NextResponse.json({ error: "A valid support message is required." }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (
      !name ||
      name.length > 120 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      !subject ||
      subject.length > 160 ||
      !message ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { error: "Enter a valid name, email, subject, and message within the length limits." },
        { status: 400 },
      );
    }

    await prisma.supportRequest.create({
      data: { name, email, subject, message },
    });

    return NextResponse.json(
      { message: "Your message was received and saved for the IRG team." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create support request error:", error);
    return NextResponse.json({ error: "Unable to send your message." }, { status: 500 });
  }
}
