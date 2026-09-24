/**
 * Utility functions to handle Prisma type serialization
 * Converts Decimal and Date fields to JSON-compatible formats
 */

function asNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value);
  if (typeof value === "object" && value !== null && "toString" in value) {
    return Number.parseFloat(String(value));
  }
  return 0;
}

export function serializeDecimal(value: unknown): number {
  return asNumber(value);
}

type ProductLike = Record<string, unknown> & {
  price?: unknown;
  Category?: unknown;
  category?: unknown;
  ProductVariant?: unknown[];
  variants?: unknown[];
};

export function serializeProduct(product: ProductLike) {
  const productVariants = Array.isArray(product.ProductVariant)
    ? product.ProductVariant
    : Array.isArray(product.variants)
      ? product.variants
      : [];

  return {
    ...product,
    price: serializeDecimal(product.price),
    category: product.Category ?? product.category,
    variants: productVariants.map((variant) => {
      const nextVariant = variant as Record<string, unknown>;
      return {
        ...nextVariant,
        price: serializeDecimal(nextVariant.price),
      };
    }),
  };
}

export function serializeProductVariant(variant: Record<string, unknown>) {
  return {
    ...variant,
    price: serializeDecimal(variant.price),
  };
}

export function serializeOrderItem(item: Record<string, unknown>) {
  return {
    ...item,
    unitPrice: serializeDecimal(item.unitPrice),
    lineTotal: serializeDecimal(item.lineTotal),
  };
}

export function serializeOrder(order: Record<string, unknown> & { items?: unknown[] }) {
  return {
    ...order,
    subtotal: serializeDecimal(order.subtotal),
    shipping: serializeDecimal(order.shipping),
    total: serializeDecimal(order.total),
    items: Array.isArray(order.items) ? order.items.map((item) => serializeOrderItem(item as Record<string, unknown>)) : [],
  };
}

export function serializePayment(payment: Record<string, unknown>) {
  return {
    ...payment,
    amount: serializeDecimal(payment.amount),
  };
}
