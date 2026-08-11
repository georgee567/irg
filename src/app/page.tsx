import BrandStory from "@/components/home/BrandStory";
import Collections from "@/components/home/Collections";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import Newsletter from "@/components/home/Newsletter";
import Testimonials from "@/components/home/Testimonials";
import WhyChoose from "@/components/home/WhyChoose";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden bg-black text-white">
      <Hero />
      <BrandStory />
      <FeaturedProducts />
      <Collections />
      <WhyChoose />
      <Testimonials />
      <Newsletter />
    </main>
  );
}