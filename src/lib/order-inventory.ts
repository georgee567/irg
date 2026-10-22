import type { Prisma } from "@/generated/prisma/client";

export async function releaseOrderInventory(
  transaction: Prisma.TransactionClient,
  orderId: string,
) {
  const order = await transaction.order.findUnique({
    where: { id: orderId },
    select: { inventoryDeducted: true },
  });
  if (!order?.inventoryDeducted) return;

  const claimed = await transaction.order.updateMany({
    where: { id: orderId, inventoryDeducted: true },
    data: { inventoryDeducted: false },
  });
  if (claimed.count !== 1) return;

  const items = await transaction.orderItem.findMany({
    where: { orderId },
    select: { variantId: true, quantity: true },
  });

  for (const item of items) {
    const updated = await transaction.productVariant.updateMany({
      where: { id: item.variantId },
      data: { stock: { increment: item.quantity } },
    });
    if (updated.count !== 1) {
      throw new Error(`Unable to restore inventory for order ${orderId}.`);
    }
  }
}

export async function deductOrderInventory(
  transaction: Prisma.TransactionClient,
  orderId: string,
) {
  const order = await transaction.order.findUnique({
    where: { id: orderId },
    select: { inventoryDeducted: true },
  });
  if (!order) throw new Error(`Order ${orderId} was not found.`);
  if (order.inventoryDeducted) return true;

  const claimed = await transaction.order.updateMany({
    where: { id: orderId, inventoryDeducted: false },
    data: { inventoryDeducted: true },
  });
  if (claimed.count !== 1) {
    const current = await transaction.order.findUnique({
      where: { id: orderId },
      select: { inventoryDeducted: true },
    });
    return current?.inventoryDeducted ?? false;
  }

  const items = await transaction.orderItem.findMany({
    where: { orderId },
    orderBy: { variantId: "asc" },
    select: { variantId: true, quantity: true },
  });
  const deducted: typeof items = [];

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error(`Order ${orderId} contains an invalid item quantity.`);
    }

    const updated = await transaction.productVariant.updateMany({
      where: {
        id: item.variantId,
        stock: { gte: item.quantity },
      },
      data: { stock: { decrement: item.quantity } },
    });

    if (updated.count !== 1) {
      for (const previous of deducted) {
        const restored = await transaction.productVariant.updateMany({
          where: { id: previous.variantId },
          data: { stock: { increment: previous.quantity } },
        });
        if (restored.count !== 1) {
          throw new Error(`Unable to restore inventory while processing order ${orderId}.`);
        }
      }

      await transaction.order.updateMany({
        where: { id: orderId, inventoryDeducted: true },
        data: { inventoryDeducted: false },
      });
      return false;
    }
    deducted.push(item);
  }

  return true;
}

export async function failPendingOrderPayment(
  transaction: Prisma.TransactionClient,
  orderId: string,
  paymentId: string,
  paymentData: Prisma.PaymentUpdateManyMutationInput,
) {
  const orderUpdate = await transaction.order.updateMany({
    where: { id: orderId, paymentStatus: "PENDING" },
    data: { paymentStatus: "FAILED", status: "CANCELLED" },
  });

  if (orderUpdate.count === 0) return false;

  const paymentUpdate = await transaction.payment.updateMany({
    where: { id: paymentId, orderId, status: "PENDING" },
    data: paymentData,
  });

  if (paymentUpdate.count !== 1) {
    throw new Error("Pending payment changed while releasing reserved inventory.");
  }

  await transaction.payment.updateMany({
    where: { orderId, status: "PENDING" },
    data: { status: "FAILED" },
  });

  await releaseOrderInventory(transaction, orderId);
  return true;
}

export async function markPendingOrderPaid(
  transaction: Prisma.TransactionClient,
  orderId: string,
  paymentId: string,
  paymentData: Prisma.PaymentUpdateManyMutationInput,
) {
  const paymentUpdate = await transaction.payment.updateMany({
    where: { id: paymentId, orderId, status: "PENDING" },
    data: paymentData,
  });
  if (paymentUpdate.count === 0) return false;

  const orderUpdate = await transaction.order.updateMany({
    where: {
      id: orderId,
      paymentStatus: "PENDING",
      status: { not: "CANCELLED" },
    },
    data: { paymentStatus: "PAID", status: "CONFIRMED" },
  });
  if (orderUpdate.count !== 1) {
    throw new Error("Confirmed payment belongs to an order that is no longer payable.");
  }

  const inventoryDeducted = await deductOrderInventory(transaction, orderId);
  if (!inventoryDeducted) {
    const review = await transaction.order.updateMany({
      where: {
        id: orderId,
        paymentStatus: "PAID",
        status: "CONFIRMED",
        inventoryDeducted: false,
      },
      data: { status: "INVENTORY_REVIEW" },
    });
    if (review.count !== 1) {
      throw new Error("Unable to flag the paid order for inventory review.");
    }
    return "INVENTORY_REVIEW";
  }
  return "CONFIRMED";
}

export async function expirePendingOrder(
  transaction: Prisma.TransactionClient,
  orderId: string,
  createdBefore: Date,
) {
  const orderUpdate = await transaction.order.updateMany({
    where: {
      id: orderId,
      status: "PENDING",
      paymentStatus: "PENDING",
      createdAt: { lt: createdBefore },
    },
    data: { paymentStatus: "FAILED", status: "CANCELLED" },
  });

  if (orderUpdate.count === 0) return false;

  await transaction.payment.updateMany({
    where: { orderId, status: "PENDING" },
    data: { status: "FAILED" },
  });

  await releaseOrderInventory(transaction, orderId);
  return true;
}

export async function expireAbandonedPendingOrders(
  transaction: Prisma.TransactionClient,
  createdBefore: Date,
  batchSize = 100,
) {
  const orders = await transaction.order.findMany({
    where: {
      status: "PENDING",
      paymentStatus: "PENDING",
      createdAt: { lt: createdBefore },
      Payment: {
        none: {
          status: "PENDING",
          provider: "M-Pesa",
          transactionReference: { not: null },
        },
      },
    },
    orderBy: { createdAt: "asc" },
    take: batchSize,
    select: { id: true },
  });

  let expired = 0;
  for (const order of orders) {
    if (await expirePendingOrder(transaction, order.id, createdBefore)) {
      expired += 1;
    }
  }
  return expired;
}
