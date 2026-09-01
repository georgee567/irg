/**
 * Utility functions to handle Prisma type serialization
 * Converts Decimal and Date fields to JSON-compatible formats
 */

export function serializeDecimal(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  // Handle Decimal object from Prisma
  return parseFloat(value.toString());
}

export function serializeProduct(product: any) {
  return {
    ...product,
    price: serializeDecimal(product.price),
    variants: product.variants?.map((v: any) => ({
      ...v,
      price: serializeDecimal(v.price),
    })) || [],
  };
}

export function serializeProductVariant(variant: any) {
  return {
    ...variant,
    price: serializeDecimal(variant.price),
  };
}

export function serializeOrderItem(item: any) {
  return {
    ...item,
    unitPrice: serializeDecimal(item.unitPrice),
    lineTotal: serializeDecimal(item.lineTotal),
  };
}

export function serializeOrder(order: any) {
  return {
    ...order,
    subtotal: serializeDecimal(order.subtotal),
    shipping: serializeDecimal(order.shipping),
    total: serializeDecimal(order.total),
    items: order.items?.map(serializeOrderItem) || [],
  };
}

export function serializePayment(payment: any) {
  return {
    ...payment,
    amount: serializeDecimal(payment.amount),
  };
}
