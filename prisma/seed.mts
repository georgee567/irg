// Seed script for IRG e-commerce database
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcryptjs";

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

async function seed() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (in correct order to respect foreign keys)
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

  // Create categories
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

  console.log("✓ Created 3 categories");

  // Hash password: "password" -> $2a$10$... (using bcryptjs)
  const hashedPassword = await bcrypt.hash("password", 10);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@irg.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✓ Created admin user: ${adminUser.email}`);

  // Create test customer user
  const customerUser = await prisma.user.create({
    data: {
      name: "Test Customer",
      email: "customer@example.com",
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  console.log(`✓ Created customer user: ${customerUser.email}`);

  // Create cart and wishlist for customer
  await prisma.cart.create({
    data: {
      userId: customerUser.id,
    },
  });

  await prisma.wishlist.create({
    data: {
      userId: customerUser.id,
    },
  });

  console.log("✓ Created cart and wishlist for customer");

  // Create products with variants
  const products = [
    {
      name: "Classic Black Blazer",
      slug: "classic-black-blazer",
      description: "Timeless black blazer perfect for any occasion. Premium fabric with impeccable tailoring.",
      price: "45000",
      images: ["/images/products/jacket-01.jpg"],
      featured: true,
      categoryId: menCategory.id,
      variants: [
        { size: "XS", color: "Black", price: "45000", stock: 10 },
        { size: "S", color: "Black", price: "45000", stock: 15 },
        { size: "M", color: "Black", price: "45000", stock: 20 },
        { size: "L", color: "Black", price: "45000", stock: 18 },
        { size: "XL", color: "Black", price: "45000", stock: 12 },
      ],
    },
    {
      name: "Premium Denim Jacket",
      slug: "premium-denim-jacket",
      description: "High-quality denim jacket with contemporary design. Perfect for layering.",
      price: "38000",
      images: ["/images/products/jacket-01.jpg"],
      featured: true,
      categoryId: menCategory.id,
      variants: [
        { size: "S", color: "Blue", price: "38000", stock: 12 },
        { size: "M", color: "Blue", price: "38000", stock: 15 },
        { size: "L", color: "Blue", price: "38000", stock: 14 },
        { size: "XL", color: "Blue", price: "38000", stock: 10 },
      ],
    },
    {
      name: "Silk Slip Dress",
      slug: "silk-slip-dress",
      description: "Elegant silk slip dress in classic black. Perfect for evening wear.",
      price: "52000",
      images: ["/images/products/jacket-01.jpg"],
      featured: true,
      categoryId: womenCategory.id,
      variants: [
        { size: "XS", color: "Black", price: "52000", stock: 8 },
        { size: "S", color: "Black", price: "52000", stock: 10 },
        { size: "M", color: "Black", price: "52000", stock: 12 },
        { size: "L", color: "Black", price: "52000", stock: 9 },
      ],
    },
    {
      name: "Designer Leather Belt",
      slug: "designer-leather-belt",
      description: "Premium Italian leather belt with gold buckle. A statement accessory.",
      price: "18000",
      images: ["/images/products/jacket-01.jpg"],
      featured: false,
      categoryId: accessoriesCategory.id,
      variants: [
        { size: "S", color: "Black", price: "18000", stock: 20 },
        { size: "M", color: "Black", price: "18000", stock: 25 },
        { size: "L", color: "Brown", price: "18000", stock: 18 },
        { size: "XL", color: "Brown", price: "18000", stock: 15 },
      ],
    },
    {
      name: "Luxury Cashmere Sweater",
      slug: "luxury-cashmere-sweater",
      description: "100% premium cashmere sweater. Soft, luxurious, and timeless.",
      price: "65000",
      images: ["/images/products/jacket-01.jpg"],
      featured: true,
      categoryId: womenCategory.id,
      variants: [
        { size: "XS", color: "Cream", price: "65000", stock: 7 },
        { size: "S", color: "Cream", price: "65000", stock: 9 },
        { size: "M", color: "Cream", price: "65000", stock: 11 },
        { size: "L", color: "Navy", price: "65000", stock: 8 },
      ],
    },
    {
      name: "Modern T-Shirt",
      slug: "modern-t-shirt",
      description: "Contemporary cotton t-shirt with premium finish. Versatile everyday wear.",
      price: "12000",
      images: ["/images/products/jacket-01.jpg"],
      featured: false,
      categoryId: menCategory.id,
      variants: [
        { size: "XS", color: "White", price: "12000", stock: 30 },
        { size: "S", color: "White", price: "12000", stock: 35 },
        { size: "M", color: "White", price: "12000", stock: 40 },
        { size: "L", color: "Black", price: "12000", stock: 35 },
        { size: "XL", color: "Black", price: "12000", stock: 25 },
      ],
    },
  ];

  for (const productData of products) {
    const { variants, ...product } = productData;

    await prisma.product.create({
      data: {
        ...product,
        variants: {
          create: variants,
        },
      },
    });

    console.log(`✓ Created product: ${productData.name}`);
  }

  console.log("✅ Database seed completed successfully!");
  console.log("\n📝 Test credentials:");
  console.log("  Admin: admin@irg.com / password");
  console.log("  Customer: customer@example.com / password");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
