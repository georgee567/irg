-- Add lifecycle timestamps missing from the original order and wishlist item tables.
-- Existing rows retain their creation time as the initial update time.
ALTER TABLE "OrderItem" ADD COLUMN "updatedAt" TIMESTAMP(3);
UPDATE "OrderItem" SET "updatedAt" = "createdAt";
ALTER TABLE "OrderItem" ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE "WishlistItem" ADD COLUMN "updatedAt" TIMESTAMP(3);
UPDATE "WishlistItem" SET "updatedAt" = "createdAt";
ALTER TABLE "WishlistItem" ALTER COLUMN "updatedAt" SET NOT NULL;
