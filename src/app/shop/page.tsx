import { notFound } from "next/navigation";
import { connection } from "next/server";

import ShopExperience from "@/components/shop/ShopExperience";
import { prisma } from "@/lib/prisma";

type ShopPageProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  await connection();
  const query = await searchParams;
  const requestedCategory = Array.isArray(query.category)
    ? query.category[0]?.trim()
    : query.category?.trim();

  const category = requestedCategory
    ? await prisma.category.findFirst({
        where: {
          OR: [
            { id: requestedCategory },
            { slug: requestedCategory.toLowerCase() },
            { name: { equals: requestedCategory, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, slug: true },
      })
    : null;

  if (requestedCategory && !category) notFound();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: category ? { categoryId: category.id } : undefined,
      include: { Category: true, ProductVariant: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { Product: { some: {} } },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const initialProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    images: product.images,
    category: product.Category,
    variants: product.ProductVariant.map((variant) => ({
      id: variant.id,
      size: variant.size,
      color: variant.color,
      price: Number(variant.price),
      stock: variant.stock,
    })),
  }));

  return (
    <ShopExperience
      initialProducts={initialProducts}
      categories={categories}
      initialCategory={category?.slug ?? "All"}
    />
  );
}
