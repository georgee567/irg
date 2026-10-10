import BrandStory from "@/components/home/BrandStory";
import Collections from "@/components/home/Collections";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import Newsletter from "@/components/home/Newsletter";
import Testimonials from "@/components/home/Testimonials";
import WhyChoose from "@/components/home/WhyChoose";
import { getSiteContent } from "@/lib/site-content";

export default async function HomePage() {
  const content = await getSiteContent("home");
  return (
    <main className="overflow-x-hidden bg-black text-white">
      <Hero content={content} />
      <BrandStory content={content} />
      <FeaturedProducts content={content} />
      <Collections content={content} />
      <WhyChoose content={content} />
      <Testimonials content={content} />
      <Newsletter content={content} />
    </main>
  );
}