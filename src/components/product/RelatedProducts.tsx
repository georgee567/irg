import Link from "next/link";
import Image from "next/image";

const products = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 20,
  name: `IRG Collection ${i + 1}`,
  price: 3999 + i * 1200,
  image: "/images/hero-model.png",
}));

export default function RelatedProducts() {
  return (
    <section className="mt-32">

      <h2 className="mb-12 font-serif text-5xl">
        Related Products
      </h2>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

        {products.map((product) => (

          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="overflow-hidden rounded-3xl border border-[#222] bg-[#090909]"
          >

            <div className="relative h-80">

              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition duration-700 hover:scale-110"
              />

            </div>

            <div className="p-6">

              <h3 className="font-serif text-2xl">
                {product.name}
              </h3>

              <p className="mt-4 text-[#D4AF37]">
                KSh {product.price.toLocaleString()}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
}
