import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
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

async function main() {
  console.log("🌱 Starting IRG database seed...\n");

  // =========================================================
  // 1. CLEAR EXISTING DATA
  // =========================================================

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

  console.log("✓ Existing database data cleared");

  // =========================================================
  // 2. CREATE CATEGORIES
  // =========================================================

  const menCategory = await prisma.category.create({
    data: {
      name: "Men",
      slug: "men",
    },
  });

  const womenCategory = await prisma.category.create({
    data: {
      name: "Women",
      slug: "women",
    },
  });

  const accessoriesCategory = await prisma.category.create({
    data: {
      name: "Accessories",
      slug: "accessories",
    },
  });

  console.log("✓ Categories created");

  // =========================================================
  // 3. CREATE PASSWORD HASH
  // =========================================================

  const password = "password";

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("✓ Password hash generated");

  // =========================================================
  // 4. CREATE ADMIN USER
  // =========================================================

  const adminUser = await prisma.user.create({
    data: {
      name: "IRG Admin",
      email: "admin@irg.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✓ Admin created: ${adminUser.email}`);

  // =========================================================
  // 5. CREATE TEST CUSTOMER
  // =========================================================

  const customerUser = await prisma.user.create({
    data: {
      name: "Test Customer",
      email: "customer@example.com",
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  console.log(`✓ Customer created: ${customerUser.email}`);

  // =========================================================
  // 6. CREATE CUSTOMER CART
  // =========================================================

  await prisma.cart.create({
    data: {
      userId: customerUser.id,
    },
  });

  console.log("✓ Customer cart created");

  // =========================================================
  // 7. CREATE CUSTOMER WISHLIST
  // =========================================================

  await prisma.wishlist.create({
    data: {
      userId: customerUser.id,
    },
  });

  console.log("✓ Customer wishlist created");

  // =========================================================
  // 8. IRG PRODUCTS
  // =========================================================

  const products = [
    {
      name: "IRG Signature Luxury Bag",

      slug: "irg-signature-luxury-bag",

      description:
        "A premium IRG luxury bag designed with a refined modern silhouette and signature branding. Crafted for everyday style and elevated streetwear.",

      price: "25000",

      images: ["/images/products/bag-01.png"],

      featured: true,

      categoryId: accessoriesCategory.id,

      variants: [
        {
          size: "One Size",
          color: "Black",
          price: "25000",
          stock: 10,
        },
      ],
    },

    {
      name: "IRG Premium Shoulder Bag",

      slug: "irg-premium-shoulder-bag",

      description:
        "A premium IRG shoulder bag combining luxury design, modern functionality, and distinctive IRG branding.",

      price: "28000",

      images: ["/images/products/bag-02.png"],

      featured: true,

      categoryId: accessoriesCategory.id,

      variants: [
        {
          size: "One Size",
          color: "Black",
          price: "28000",
          stock: 10,
        },
      ],
    },

    {
      name: "IRG Signature Performance Shorts",

      slug: "irg-signature-performance-shorts",

      description:
        "Premium IRG signature shorts designed for comfort, movement, and modern luxury streetwear. Finished with distinctive IRG branding.",

      price: "8500",

      images: ["/images/products/shorts-01.png"],

      featured: true,

      categoryId: menCategory.id,

      variants: [
        {
          size: "S",
          color: "Yellow",
          price: "8500",
          stock: 10,
        },

        {
          size: "M",
          color: "Yellow",
          price: "8500",
          stock: 15,
        },

        {
          size: "L",
          color: "Yellow",
          price: "8500",
          stock: 12,
        },

        {
          size: "XL",
          color: "Yellow",
          price: "8500",
          stock: 8,
        },
      ],
    },
  ];

  // =========================================================
  // 9. CREATE PRODUCTS
  // =========================================================

  for (const productData of products) {
    const { variants, ...product } = productData;

    const createdProduct = await prisma.product.create({
      data: {
        ...product,

        variants: {
          create: variants,
        },
      },

      include: {
        ProductVariant: true,
        Category: true,
      },
    });

    console.log(`✓ Product created: ${createdProduct.name}`);
  }

  // =========================================================
  // 10. FINISHED
  // =========================================================

  console.log("\n========================================");
  console.log("✅ IRG DATABASE SEED COMPLETED");
  console.log("========================================");

  console.log("\nAdmin login:");
  console.log("Email:    admin@irg.com");
  console.log("Password: password");

  console.log("\nCustomer login:");
  console.log("Email:    customer@example.com");
  console.log("Password: password");

  console.log("\nProducts created:");
  console.log("1. IRG Signature Luxury Bag");
  console.log("2. IRG Premium Shoulder Bag");
  console.log("3. IRG Signature Performance Shorts");

  console.log("\nImages:");
  console.log("/images/products/bag-01.png");
  console.log("/images/products/bag-02.png");
  console.log("/images/products/shorts-01.png");

  console.log("\nAdmin dashboard:");
  console.log("/admin/products");
}

main()
  .catch((error) => {
    console.error("\n❌ IRG SEED FAILED:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });