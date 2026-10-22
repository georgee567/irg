import FeaturedProducts from "@/components/home/FeaturedProducts";
import ShopFilters from "@/components/shop/ShopFilters";
import { prisma } from "@/lib/prisma";

export default async function ProductGrid() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      ProductVariant: { select: { id: true, stock: true } },
    },
  });

  return (
    <>
      <ShopFilters onCategoryChange={() => {}} />

      <FeaturedProducts
        products={products.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          images: product.images,
          variants: product.ProductVariant,
        }))}
      />
    </>
  );
}