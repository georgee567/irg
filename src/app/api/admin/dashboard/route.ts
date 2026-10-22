import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

function utcStartOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function percentageChange(current: number, previous: number) {
  return previous === 0 ? null : ((current - previous) / previous) * 100;
}

function amount(value: { toString(): string } | null | undefined) {
  return Number(value?.toString() ?? 0);
}

export async function GET() {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const now = new Date();
    const startToday = utcStartOfDay(now);
    const startYesterday = new Date(startToday.getTime() - 24 * 60 * 60 * 1000);
    const dayOfWeekFromMonday = (startToday.getUTCDay() + 6) % 7;
    const startThisWeek = new Date(startToday.getTime() - dayOfWeekFromMonday * 24 * 60 * 60 * 1000);
    const startLastWeek = new Date(startThisWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previousWeekEnd = new Date(
      startLastWeek.getTime() + (now.getTime() - startThisWeek.getTime()),
    );
    const startThisMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const startLastMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const previousMonthEnd = new Date(Math.min(
      startLastMonth.getTime() + (now.getTime() - startThisMonth.getTime()),
      startThisMonth.getTime(),
    ));
    const startTrend = new Date(startToday.getTime() - 29 * 24 * 60 * 60 * 1000);

    const paid = { paymentStatus: "PAID" as const };
    const [
      customerCount,
      productCount,
      categoryCount,
      orderCount,
      paidOrderAggregate,
      paidOrderCount,
      todayAggregate,
      yesterdayAggregate,
      weekAggregate,
      lastWeekAggregate,
      monthAggregate,
      lastMonthAggregate,
      monthPaidOrderCount,
      lastMonthPaidOrderCount,
      newCustomers,
      previousNewCustomers,
      customersWithOrders,
      inStockProducts,
      lowStockVariants,
      outOfStockProducts,
      statusGroups,
      paymentStatusGroups,
      reviewCount,
      pendingReviewCount,
      supportRequestCount,
      wishlistActivity,
      monthItems,
      lastMonthItems,
      trendOrders,
      trendPaidOrders,
      trendCustomers,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.aggregate({ where: paid, _sum: { total: true }, _avg: { total: true } }),
      prisma.order.count({ where: paid }),
      prisma.order.aggregate({ where: { ...paid, createdAt: { gte: startToday } }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { ...paid, createdAt: { gte: startYesterday, lt: startToday } }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { ...paid, createdAt: { gte: startThisWeek } }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { ...paid, createdAt: { gte: startLastWeek, lt: previousWeekEnd } }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { ...paid, createdAt: { gte: startThisMonth } }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { ...paid, createdAt: { gte: startLastMonth, lt: previousMonthEnd } }, _sum: { total: true } }),
      prisma.order.count({ where: { ...paid, createdAt: { gte: startThisMonth } } }),
      prisma.order.count({ where: { ...paid, createdAt: { gte: startLastMonth, lt: previousMonthEnd } } }),
      prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: startThisMonth } } }),
      prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: startLastMonth, lt: previousMonthEnd } } }),
      prisma.order.groupBy({ by: ["userId"], where: paid, _count: { _all: true } }),
      prisma.product.count({ where: { ProductVariant: { some: { stock: { gt: 0 } } } } }),
      prisma.productVariant.findMany({
        where: { stock: { gt: 0, lte: 5 } },
        distinct: ["productId"],
        select: { productId: true, Product: { select: { name: true } } },
      }),
      prisma.product.count({ where: { ProductVariant: { none: { stock: { gt: 0 } } } } }),
      prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.payment.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.productReview.count({ where: { status: "APPROVED" } }),
      prisma.productReview.count({ where: { status: "PENDING" } }),
      prisma.supportRequest.count({ where: { status: { in: ["NEW", "IN_PROGRESS"] } } }),
      prisma.wishlistItem.count(),
      prisma.orderItem.findMany({
        where: { Order: { paymentStatus: "PAID", createdAt: { gte: startThisMonth } } },
        select: {
          productId: true,
          productName: true,
          quantity: true,
          lineTotal: true,
          Product: { select: { Category: { select: { id: true, name: true } } } },
        },
      }),
      prisma.orderItem.findMany({
        where: {
          Order: {
            paymentStatus: "PAID",
            createdAt: { gte: startLastMonth, lt: previousMonthEnd },
          },
        },
        select: {
          productId: true,
          productName: true,
          quantity: true,
          lineTotal: true,
          Product: { select: { Category: { select: { id: true, name: true } } } },
        },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: startTrend } },
        select: { createdAt: true },
      }),
      prisma.order.findMany({
        where: { ...paid, createdAt: { gte: startTrend } },
        select: { createdAt: true, total: true },
      }),
      prisma.user.findMany({
        where: { role: "CUSTOMER", createdAt: { gte: startTrend } },
        select: { createdAt: true },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          shippingName: true,
        },
      }),
    ]);

    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    const categorySales = new Map<string, { name: string; quantity: number; revenue: number }>();
    const previousProductSales = new Map<string, number>();
    const previousProductNames = new Map<string, string>();
    const previousCategorySales = new Map<string, number>();
    const previousCategoryNames = new Map<string, string>();

    for (const item of monthItems) {
      const revenue = Number(item.lineTotal);
      const product = productSales.get(item.productId) ?? {
        name: item.productName,
        quantity: 0,
        revenue: 0,
      };
      product.quantity += item.quantity;
      product.revenue += revenue;
      productSales.set(item.productId, product);

      const category = categorySales.get(item.Product.Category.id) ?? {
        name: item.Product.Category.name,
        quantity: 0,
        revenue: 0,
      };
      category.quantity += item.quantity;
      category.revenue += revenue;
      categorySales.set(item.Product.Category.id, category);
    }

    for (const item of lastMonthItems) {
      previousProductSales.set(
        item.productId,
        (previousProductSales.get(item.productId) ?? 0) + item.quantity,
      );
      previousProductNames.set(item.productId, item.productName);
      const categoryId = item.Product.Category.id;
      previousCategorySales.set(
        categoryId,
        (previousCategorySales.get(categoryId) ?? 0) + item.quantity,
      );
      previousCategoryNames.set(categoryId, item.Product.Category.name);
    }

    const trendDays = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(startTrend.getTime() + index * 24 * 60 * 60 * 1000);
      const key = date.toISOString().slice(0, 10);
      return { date: key, revenue: 0, orders: 0, customers: 0 };
    });
    const trendByDate = new Map(trendDays.map((day) => [day.date, day]));
    for (const order of trendPaidOrders) {
      const day = trendByDate.get(order.createdAt.toISOString().slice(0, 10));
      if (day) day.revenue += Number(order.total);
    }
    for (const order of trendOrders) {
      const day = trendByDate.get(order.createdAt.toISOString().slice(0, 10));
      if (day) day.orders += 1;
    }
    for (const customer of trendCustomers) {
      const day = trendByDate.get(customer.createdAt.toISOString().slice(0, 10));
      if (day) day.customers += 1;
    }

    const currentMonthRevenue = amount(monthAggregate._sum.total);
    const previousMonthRevenue = amount(lastMonthAggregate._sum.total);
    const currentWeekRevenue = amount(weekAggregate._sum.total);
    const previousWeekRevenue = amount(lastWeekAggregate._sum.total);
    const currentDayRevenue = amount(todayAggregate._sum.total);
    const previousDayRevenue = amount(yesterdayAggregate._sum.total);
    const customerGrowth = percentageChange(newCustomers, previousNewCustomers);
    const revenueGrowth = percentageChange(currentMonthRevenue, previousMonthRevenue);

    const bestSellingProducts = [...productSales.entries()]
      .map(([id, sale]) => ({
        id,
        ...sale,
        quantityChange: sale.quantity - (previousProductSales.get(id) ?? 0),
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    const bestCategories = [...categorySales.entries()]
      .map(([id, sale]) => ({
        id,
        ...sale,
        quantityChange: sale.quantity - (previousCategorySales.get(id) ?? 0),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    const productDemandChanges = [...new Set([
      ...productSales.keys(),
      ...previousProductSales.keys(),
    ])].map((id) => ({
      id,
      name: productSales.get(id)?.name ?? previousProductNames.get(id) ?? "Product",
      currentQuantity: productSales.get(id)?.quantity ?? 0,
      previousQuantity: previousProductSales.get(id) ?? 0,
      quantityChange: (productSales.get(id)?.quantity ?? 0) - (previousProductSales.get(id) ?? 0),
    }));
    const categoryDemandChanges = [...new Set([
      ...categorySales.keys(),
      ...previousCategorySales.keys(),
    ])].map((id) => ({
      id,
      name: categorySales.get(id)?.name ?? previousCategoryNames.get(id) ?? "Category",
      currentQuantity: categorySales.get(id)?.quantity ?? 0,
      previousQuantity: previousCategorySales.get(id) ?? 0,
      quantityChange: (categorySales.get(id)?.quantity ?? 0) - (previousCategorySales.get(id) ?? 0),
    }));
    const orderStatuses = Object.fromEntries(
      statusGroups.map((group) => [group.status, group._count._all]),
    ) as Record<string, number>;
    const paymentStatuses = Object.fromEntries(
      paymentStatusGroups.map((group) => [group.status, group._count._all]),
    ) as Record<string, number>;
    const returningCustomers = customersWithOrders.filter(
      (customer) => customer._count._all > 1,
    ).length;

    const insights: string[] = [];
    if (revenueGrowth !== null) {
      const trend = revenueGrowth >= 0 ? "increased" : "decreased";
      insights.push(`Paid revenue ${trend} ${Math.abs(revenueGrowth).toFixed(1)}% compared with the same period last month.`);
    }
    if (bestCategories[0]) {
      insights.push(
        `${bestCategories[0].name} generated KSh ${Math.round(bestCategories[0].revenue).toLocaleString()} in paid sales this month.`,
      );
    }
    if (lowStockVariants.length > 0) {
      insights.push(
        `Low stock: ${lowStockVariants.slice(0, 3).map((item) => item.Product.name).join(", ")}.`,
      );
    }
    if (customerGrowth !== null && customerGrowth < 0) {
      insights.push(`New customer registrations decreased ${Math.abs(customerGrowth).toFixed(1)}% compared with last month.`);
    }
    if (insights.length === 0) {
      insights.push("Insights will appear as real sales, customer, and inventory data becomes available.");
    }

    return NextResponse.json({
      statistics: {
        users: customerCount,
        products: productCount,
        categories: categoryCount,
        orders: orderCount,
        revenue: amount(paidOrderAggregate._sum.total),
        paidOrders: paidOrderCount,
        paidOrdersThisMonth: monthPaidOrderCount,
        paidOrdersLastMonth: lastMonthPaidOrderCount,
        averageOrderValue: amount(paidOrderAggregate._avg.total),
        revenueToday: currentDayRevenue,
        revenueYesterday: previousDayRevenue,
        revenueTodayGrowth: percentageChange(currentDayRevenue, previousDayRevenue),
        revenueWeek: currentWeekRevenue,
        revenueLastWeek: previousWeekRevenue,
        revenueWeekGrowth: percentageChange(currentWeekRevenue, previousWeekRevenue),
        revenueMonth: currentMonthRevenue,
        revenueLastMonth: previousMonthRevenue,
        revenueGrowth,
        newCustomers,
        previousNewCustomers,
        customerGrowth,
        returningCustomers,
        productsInStock: inStockProducts,
        lowStock: lowStockVariants.length,
        outOfStock: outOfStockProducts,
        orderStatuses,
        paymentStatuses,
        engagement: {
          approvedReviews: reviewCount,
          reviewsAwaitingModeration: pendingReviewCount,
          openSupportRequests: supportRequestCount,
          wishlistItems: wishlistActivity,
        },
      },
      trends: trendDays,
      bestSellingProducts,
      bestCategories,
      productDemandChanges: {
        gaining: [...productDemandChanges].sort((a, b) => b.quantityChange - a.quantityChange).slice(0, 5),
        declining: [...productDemandChanges].sort((a, b) => a.quantityChange - b.quantityChange).slice(0, 5),
      },
      categoryDemandChanges: {
        gaining: [...categoryDemandChanges].sort((a, b) => b.quantityChange - a.quantityChange).slice(0, 5),
        declining: [...categoryDemandChanges].sort((a, b) => a.quantityChange - b.quantityChange).slice(0, 5),
      },
      insights,
      recentOrders: recentOrders.map((order) => ({
        ...order,
        total: Number(order.total),
      })),
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: "Unable to load dashboard statistics." },
      { status: 500 },
    );
  }
}
