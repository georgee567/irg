ALTER TYPE "OrderStatus" ADD VALUE 'INVENTORY_REVIEW';

ALTER TABLE "Order"
ADD COLUMN "inventoryDeducted" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Order"
SET "inventoryDeducted" = true,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "paymentStatus" = 'PAID';

WITH "pendingInventory" AS (
  SELECT "OrderItem"."variantId", SUM("OrderItem"."quantity") AS quantity
  FROM "OrderItem"
  INNER JOIN "Order" ON "Order"."id" = "OrderItem"."orderId"
  WHERE "Order"."paymentStatus" = 'PENDING'
    AND "Order"."status" <> 'CANCELLED'
  GROUP BY "OrderItem"."variantId"
)
UPDATE "ProductVariant"
SET "stock" = "ProductVariant"."stock" + "pendingInventory".quantity,
    "updatedAt" = CURRENT_TIMESTAMP
FROM "pendingInventory"
WHERE "ProductVariant"."id" = "pendingInventory"."variantId";

UPDATE "Order"
SET "inventoryDeducted" = false,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "paymentStatus" = 'PENDING'
  AND "status" <> 'CANCELLED';
