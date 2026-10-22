import BrandStory from "@/components/home/BrandStory";
import Collections from "@/components/home/Collections";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import Newsletter from "@/components/home/Newsletter";
import Testimonials from "@/components/home/Testimonials";
import WhyChoose from "@/components/home/WhyChoose";
import { getSiteContent } from "@/lib/site-content";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";

export default async function HomePage() {
  await connection();
  const [content, productCount, customerCount, reviews, products, categories] = await Promise.all([
    getSiteContent("home"),
    prisma.product.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.productReview.findMany({
      where: { status: "APPROVED" },
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        body: true,
        User: { select: { name: true } },
      },
    }),
    prisma.product.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: {
        Category: true,
        ProductVariant: {
          select: { id: true, stock: true },
        },
      },
    }),
    prisma.category.findMany({
      where: { Product: { some: {} } },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <main className="overflow-x-hidden bg-black text-white">
      <Hero content={content} productCount={productCount} customerCount={customerCount} />
      <BrandStory content={content} />
      <FeaturedProducts
        content={content}
        products={products.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          images: product.images,
          variants: product.ProductVariant,
        }))}
      />
      <Collections content={content} categories={categories} />
      <WhyChoose content={content} />
      <Testimonials
        content={content}
        reviews={reviews.map((review) => {
          const [firstName, ...lastNames] = review.User.name.trim().split(/\s+/);
          const lastNameInitial = lastNames.at(-1)?.[0];
          return {
            id: review.id,
            rating: review.rating,
            text: review.body,
            name: firstName
              ? `${firstName}${lastNameInitial ? ` ${lastNameInitial}.` : ""}`
              : "IRG Customer",
          };
        })}
      />
      <Newsletter content={content} />
    </main>
  );
}