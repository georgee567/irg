import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { Product } from "@/types/models";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({
  params,
}: Props) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      Category: true,
      ProductVariant: true,
    },
  });

  if (!product) {
    notFound();
  }

  const serializedProduct: Product = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price.toString(),
    images: product.images,
    featured: product.featured,
    categoryId: product.categoryId,
    category: {
      ...product.Category,
      createdAt: product.Category.createdAt.toISOString(),
      updatedAt: product.Category.updatedAt.toISOString(),
    },
    variants: product.ProductVariant.map((variant) => ({
      id: variant.id,
      size: variant.size,
      color: variant.color,
      price: variant.price.toString(),
      stock: variant.stock,
      productId: variant.productId,
      createdAt: variant.createdAt.toISOString(),
      updatedAt: variant.updatedAt.toISOString(),
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-8 py-24">
        <div className="grid gap-20 lg:grid-cols-2">
          <ProductGallery product={serializedProduct} />
          <ProductInfo product={serializedProduct} />
        </div>

        <ProductReviews productId={serializedProduct.id} />

        <RelatedProducts
          productId={serializedProduct.id}
          categoryId={serializedProduct.categoryId}
        />
      </div>
    </main>
  );
}