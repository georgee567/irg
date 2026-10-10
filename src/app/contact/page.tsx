import PageMedia from "@/components/home/PageMedia";
import { getSiteContent } from "@/lib/site-content";

export default async function ContactPage() {
  const content = await getSiteContent("contact");
  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center px-8">

      <div className="max-w-3xl text-center">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          {content.eyebrow}
        </p>

        <h1 className="mt-5 font-serif text-6xl">
          {content.title}
        </h1>

        <p className="mt-8 text-lg leading-8 text-gray-400">
          Email: {content.email}
          <br />
          Phone: {content.phoneOne}
          <br />
          Phone: {content.phoneTwo}
          <br />
          {content.location}
        </p>
        <PageMedia url={content.mediaUrl} alt={content.mediaAlt} />

      </div>

    </main>
  );
}