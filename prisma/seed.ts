import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";

import { PrismaClient } from "@/generated/prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const timestamps = () => ({
  id: randomUUID(),
  updatedAt: new Date(),
});

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_SEED !== "true") {
    throw new Error("Refusing to run the demo seed in production. Set ALLOW_DEMO_SEED=true only for an intentional, reviewed seed operation.");
  }

  const existingData = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
  ]);

  if (existingData.some((count) => count > 0) && process.env.ALLOW_DEMO_SEED !== "true") {
    throw new Error("Refusing to seed a populated database. Existing business data was left unchanged.");
  }

  console.log("🌱 Starting database seed...");

  // ==========================================
  // CLEAR EXISTING DATA
  // ==========================================

  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();

  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();

  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();

  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  await prisma.category.deleteMany();

  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log("✓ Cleared existing data");

  // ==========================================
  // CREATE CATEGORIES
  // ==========================================

  const menCategory = await prisma.category.create({
    data: {
      ...timestamps(),
      name: "Men",
      slug: "men",
    },
  });

  await prisma.category.create({
    data: {
      ...timestamps(),
      name: "Women",
      slug: "women",
    },
  });

  const irgCategory = await prisma.category.create({
    data: {
      ...timestamps(),
      name: "IRG",
      slug: "irg",
    },
  });

  const accessoriesCategory = await prisma.category.create({
    data: {
      ...timestamps(),
      name: "Accessories",
      slug: "accessories",
    },
  });

  console.log("✓ Created categories");

  // ==========================================
  // CREATE USERS
  // ==========================================

  const hashedPassword = await bcrypt.hash("password", 10);

  const adminUser = await prisma.user.create({
    data: {
      ...timestamps(),
      name: "Admin User",
      email: "admin@irg.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✓ Created admin user: ${adminUser.email}`);

  const customerUser = await prisma.user.create({
    data: {
      ...timestamps(),
      name: "Test Customer",
      email: "customer@example.com",
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  console.log(`✓ Created customer user: ${customerUser.email}`);

  // ==========================================
  // CREATE CUSTOMER CART
  // ==========================================

  await prisma.cart.create({
    data: {
      ...timestamps(),
      userId: customerUser.id,
    },
  });

  // ==========================================
  // CREATE CUSTOMER WISHLIST
  // ==========================================

  await prisma.wishlist.create({
    data: {
      ...timestamps(),
      userId: customerUser.id,
    },
  });

  console.log("✓ Created cart and wishlist for customer");

  // ==========================================
  // IRG REAL PRODUCTS
  // ==========================================

  const products = [
    {
      id: randomUUID(),
      name: "IRG Signature Luxury Bag",
      slug: "irg-signature-luxury-bag",
      description:
        "A premium IRG luxury bag designed with a refined modern silhouette and signature branding. Crafted for everyday style and elevated streetwear.",
      price: "25000",
      images: [
        "/images/products/bag-01.png",
      ],
      featured: true,
      categoryId: accessoriesCategory.id,
      variants: [
        {
          ...timestamps(),
          size: "One Size",
          color: "Black",
          price: "25000",
          stock: 10,
        },
      ],
    },

    {
      id: randomUUID(),
      name: "IRG Premium Shoulder Bag",
      slug: "irg-premium-shoulder-bag",
      description:
        "A premium IRG shoulder bag combining luxury design, modern functionality, and distinctive IRG branding.",
      price: "28000",
      images: [
        "/images/products/bag-02.png",
      ],
      featured: true,
      categoryId: accessoriesCategory.id,
      variants: [
        {
          ...timestamps(),
          size: "One Size",
          color: "Black",
          price: "28000",
          stock: 10,
        },
      ],
    },

    {
      id: randomUUID(),
      name: "IRG Signature Performance Shorts",
      slug: "irg-signature-performance-shorts",
      description:
        "Premium IRG signature shorts designed for comfort, movement, and modern luxury streetwear. Finished with distinctive IRG branding.",
      price: "8500",
      images: [
        "/images/products/shorts-01.png",
      ],
      featured: true,
      categoryId: menCategory.id,
      variants: [
        {
          ...timestamps(),
          size: "S",
          color: "Yellow",
          price: "8500",
          stock: 10,
        },
        {
          ...timestamps(),
          size: "M",
          color: "Yellow",
          price: "8500",
          stock: 15,
        },
        {
          ...timestamps(),
          size: "L",
          color: "Yellow",
          price: "8500",
          stock: 12,
        },
        {
          ...timestamps(),
          size: "XL",
          color: "Yellow",
          price: "8500",
          stock: 8,
        },
      ],
    },

    {
      id: randomUUID(),
      name: "IRG Knit Sweater",
      slug: "irg-knit-sweater",
      description:
        "A premium IRG knit sweater designed with a clean silhouette, elevated texture, and the refined luxury feel of the IRG brand.",
      price: "18000",
      images: [
        "/images/products/sweater-01.png",
      ],
      featured: true,
      categoryId: irgCategory.id,
      variants: [
        {
          ...timestamps(),
          size: "S",
          color: "Cream",
          price: "18000",
          stock: 8,
        },
        {
          ...timestamps(),
          size: "M",
          color: "Cream",
          price: "18000",
          stock: 10,
        },
        {
          ...timestamps(),
          size: "L",
          color: "Cream",
          price: "18000",
          stock: 9,
        },
      ],
    },
  ];

  // ==========================================
  // CREATE PRODUCTS AND VARIANTS
  // ==========================================

  for (const productData of products) {
    const { variants, ...product } = productData;

    await prisma.product.create({
      data: {
        updatedAt: new Date(),
        ...product,

        ProductVariant: {
          create: variants,
        },
      },
    });

    console.log(`✓ Created product: ${productData.name}`);
  }

  console.log("✅ Database seed completed successfully!");

  console.log("\n📝 Test credentials:");

  console.log("  Admin:");
  console.log("  admin@irg.com / password");

  console.log("\n  Customer:");
  console.log("  customer@example.com / password");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });