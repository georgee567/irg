import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { expireAbandonedPendingOrders } from "@/lib/order-inventory";

type CheckoutBody = {
  shippingName?: string;
  shippingEmail?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingCountry?: string;
};

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        OrderItem: true,
        Payment: {
          select: {
            id: true,
            provider: true,
            method: true,
            transactionReference: true,
            amount: true,
            currency: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return NextResponse.json(
      { error: "Unable to fetch orders." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CheckoutBody;

    const requiredFields = [
      "shippingName",
      "shippingEmail",
      "shippingPhone",
      "shippingAddress",
      "shippingCity",
      "shippingCountry",
    ] as const;

    for (const field of requiredFields) {
      if (
        typeof body[field] !== "string" ||
        body[field].trim() === ""
      ) {
        return NextResponse.json(
          { error: `${field} is required.` },
          { status: 400 }
        );
      }
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        CartItem: {
          include: {
            ProductVariant: {
              include: {
                Product: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.CartItem.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      await expireAbandonedPendingOrders(
        tx,
        new Date(Date.now() - 30 * 60 * 1000),
      );

      const variantIds = cart.CartItem.map(
        (item) => item.variantId
      );

      const variants = await tx.productVariant.findMany({
        where: {
          id: {
            in: variantIds,
          },
        },
        include: {
          Product: true,
        },
      });

      const variantMap = new Map(
        variants.map((variant) => [variant.id, variant])
      );

      let subtotal = new Prisma.Decimal(0);

      const orderItems: {
        id: string;
        productId: string;
        variantId: string;
        productName: string;
        size: string;
        color: string;
        unitPrice: Prisma.Decimal;
        quantity: number;
        lineTotal: Prisma.Decimal;
      }[] = [];

      for (const cartItem of cart.CartItem) {
        const variant = variantMap.get(cartItem.variantId);

        if (!variant) {
          throw new Error(
            `Product variant ${cartItem.variantId} no longer exists.`
          );
        }

        if (cartItem.quantity > variant.stock) {
          throw new Error(
            `Insufficient stock for ${variant.Product.name} (${variant.size}, ${variant.color}).`
          );
        }

        const unitPrice = variant.price;
        const lineTotal = unitPrice.mul(cartItem.quantity);

        subtotal = subtotal.add(lineTotal);

        orderItems.push({
          id: crypto.randomUUID(),
          productId: variant.productId,
          variantId: variant.id,
          productName: variant.Product.name,
          size: variant.size,
          color: variant.color,
          unitPrice,
          quantity: cartItem.quantity,
          lineTotal,
        });
      }

      const shipping = new Prisma.Decimal(0);
      const total = subtotal.add(shipping);

      const order = await tx.order.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          updatedAt: new Date(),

          status: "PENDING",
          paymentStatus: "PENDING",

          subtotal,
          shipping,
          total,

          shippingName: body.shippingName!.trim(),
          shippingEmail: body.shippingEmail!.trim().toLowerCase(),
          shippingPhone: body.shippingPhone!.trim(),
          shippingAddress: body.shippingAddress!.trim(),
          shippingCity: body.shippingCity!.trim(),
          shippingCountry: body.shippingCountry!.trim(),
        },

        include: {
          OrderItem: true,
          Payment: true,
        },
      });

      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          id: item.id,
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId,
          productName: item.productName,
          size: item.size,
          color: item.color,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
          updatedAt: new Date(),
        })),
      });

      return tx.order.findUnique({
        where: {
          id: order.id,
        },
        include: {
          OrderItem: true,
          Payment: true,
        },
      });
    });

    return NextResponse.json(
      {
        message: "Order created successfully.",
        order: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create order.";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}