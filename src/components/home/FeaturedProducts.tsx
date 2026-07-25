import Image from "next/image";
import { Heart } from "lucide-react";

const products = [
  { name: "IRG Oversized Tee", category: "T-Shirts", price: "KSh 3,499", badge: "NEW" },
  { name: "IRG Signature Jacket", category: "Outerwear", price: "KSh 8,999", badge: "BESTSELLER" },
  { name: "IRG Cargo Pants", category: "Bottoms", price: "KSh 5,999", badge: "LIMITED" },
  { name: "IRG Leather Sneakers", category: "Footwear", price: "KSh 9,999", badge: "HOT" },
  { name: "IRG Women's Dress", category: "Women", price: "KSh 7,499", badge: "NEW" },
  { name: "IRG Crossbody Bag", category: "Accessories", price: "KSh 4,999", badge: "TRENDING" },
  { name: "IRG Denim Jeans", category: "Denim", price: "KSh 6,499", badge: "NEW" },
  { name: "IRG Luxury Cap", category: "Accessories", price: "KSh 2,999", badge: "HOT" },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-[#050505] py-32">

      <div className="mx-auto max-w-7xl px-8">

        <div className="mb-16 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            FEATURED PRODUCTS
          </p>

          <h2 className="mt-5 font-serif text-6xl text-white">
            Shop The Collection
          </h2>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {products.map((product) => (

            <div
              key={product.name}
              className="group overflow-hidden rounded-[30px] border border-[#1d1d1d] bg-black"
            >

              <div className="relative h-[380px] overflow-hidden">

                <Image
                  src="/images/hero-model.png"
                  alt={product.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <span className="absolute left-5 top-5 rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                  {product.badge}
                </span>

                <button className="absolute right-5 top-5 rounded-full bg-black/60 p-3 backdrop-blur-md">
                  <Heart size={18} />
                </button>

              </div>

              <div className="p-7">

                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                  {product.category}
                </p>

                <h3 className="mt-3 font-serif text-2xl text-white">
                  {product.name}
                </h3>

                <p className="mt-5 text-xl font-semibold text-white">
                  {product.price}
                </p>

                <button className="mt-7 w-full rounded-full border border-[#D4AF37] py-3 text-sm uppercase tracking-[0.25em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black">
                  Add To Cart
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}