import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const [
      users,
      products,
      categories,
      orders,
      paidOrders,
      lowStock,
      outOfStock,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.findMany({
        where: {
          paymentStatus: "PAID",
        },
        select: {
          total: true,
        },
      }),
      prisma.productVariant.count({ where: { stock: { gt: 0, lte: 5 } } }),
      prisma.productVariant.count({ where: { stock: 0 } }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: { id: true, total: true, status: true, paymentStatus: true, createdAt: true, shippingName: true },
      }),
    ]);

    const revenue = paidOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );

    return NextResponse.json({
      statistics: {
        users,
        products,
        categories,
        orders,
        revenue,
        lowStock,
        outOfStock,
      },
      recentOrders: recentOrders.map((order) => ({ ...order, total: Number(order.total) })),
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return NextResponse.json(
      {
        error:
          "Unable to load dashboard statistics.",
      },
      { status: 500 }
    );
  }
}
