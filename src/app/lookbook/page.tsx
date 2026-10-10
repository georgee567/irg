import PageMedia from "@/components/home/PageMedia";
import { getSiteContent } from "@/lib/site-content";

export default async function LookbookPage() {
  const content = await getSiteContent("lookbook");
  return (
    <main className="min-h-screen bg-black text-white">

      <section className="mx-auto max-w-7xl px-8 py-32">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          {content.eyebrow}
        </p>

        <h1 className="mt-5 font-serif text-6xl">
          {content.title}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400">
          {content.description}
        </p>

        <PageMedia url={content.mediaUrl} alt={content.mediaAlt} />
      </section>

    </main>
  );
}