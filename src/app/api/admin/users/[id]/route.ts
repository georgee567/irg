import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user: admin, response } = await requireAdmin();

    if (response) {
      return response;
    }

    if (!admin) {
      return NextResponse.json(
        { error: "Admin authentication required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const { role } = body;

    if (role !== "CUSTOMER" && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Invalid role." },
        { status: 400 }
      );
    }

    if (id === admin.id && role !== "ADMIN") {
      return NextResponse.json(
        { error: "You cannot remove your own admin role." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "User role updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user role error:", error);

    return NextResponse.json(
      { error: "Unable to update user role." },
      { status: 500 }
    );
  }
}
