CREATE TYPE "EditorialType" AS ENUM ('LOOKBOOK', 'JOURNAL');

CREATE TABLE "EditorialEntry" (
    "id" TEXT NOT NULL,
    "type" "EditorialType" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditorialEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EditorialEntry_type_slug_key"
    ON "EditorialEntry"("type", "slug");
CREATE INDEX "EditorialEntry_type_published_publishedAt_idx"
    ON "EditorialEntry"("type", "published", "publishedAt");

ALTER TABLE "EditorialEntry"
    ADD CONSTRAINT "EditorialEntry_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
