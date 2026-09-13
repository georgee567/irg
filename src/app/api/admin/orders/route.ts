import crypto from "crypto";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type CheckoutBody = {
  shippingName?: string;
  shippingEmail?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingCountry?: string;
};

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
        variants.map((variant) => [
          variant.id,
          variant,
        ])
      );

      let subtotal = new Prisma.Decimal(0);

      const orderItems = [];

      for (const cartItem of cart.CartItem) {
        const variant = variantMap.get(
          cartItem.variantId
        );

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

        const lineTotal = unitPrice.mul(
          cartItem.quantity
        );

        subtotal = subtotal.add(lineTotal);

        orderItems.push({
          id: crypto.randomUUID(),
          Product: {
            connect: {
              id: variant.productId,
            },
          },
          ProductVariant: {
            connect: {
              id: variant.id,
            },
          },
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

          status: "PENDING",
          paymentStatus: "PENDING",

          subtotal,
          shipping,
          total,

          shippingName: body.shippingName!.trim(),

          shippingEmail:
            body.shippingEmail!
              .trim()
              .toLowerCase(),

          shippingPhone:
            body.shippingPhone!.trim(),

          shippingAddress:
            body.shippingAddress!.trim(),

          shippingCity:
            body.shippingCity!.trim(),

          shippingCountry:
            body.shippingCountry!.trim(),

          updatedAt: new Date(),
          OrderItem: {
            create: orderItems,
          },

          Payment: {
            create: {
              id: crypto.randomUUID(),
              provider: "PENDING",
              method: "UNSELECTED",
              amount: total,
              currency: "KES",
              status: "PENDING",
              updatedAt: new Date(),
            },
          },
        },

        include: {
          OrderItem: true,
          Payment: true,
        },
      });

      for (const cartItem of cart.CartItem) {
        const updated =
          await tx.productVariant.updateMany({
            where: {
              id: cartItem.variantId,
              stock: {
                gte: cartItem.quantity,
              },
            },

            data: {
              stock: {
                decrement: cartItem.quantity,
              },
            },
          });

        if (updated.count !== 1) {
          throw new Error(
            "Stock changed while creating the order. Please try again."
          );
        }
      }

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return order;
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




