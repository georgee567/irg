import BrandStory from "@/components/home/BrandStory";
import WhyChoose from "@/components/home/WhyChoose";
import PageMedia from "@/components/home/PageMedia";
import { getSiteContent } from "@/lib/site-content";

export default async function AboutPage() {
  const [pageContent, homeContent] = await Promise.all([
    getSiteContent("about"),
    getSiteContent("home"),
  ]);
  return (
    <main className="bg-black text-white min-h-screen">
      <section className="mx-auto max-w-7xl px-8 py-28">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">{pageContent.eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-serif text-5xl md:text-6xl">{pageContent.title}</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-400">{pageContent.description}</p>
        <PageMedia url={pageContent.mediaUrl} alt={pageContent.mediaAlt} />
      </section>
      <BrandStory content={homeContent} />
      <WhyChoose content={homeContent} />
    </main>
  );
}