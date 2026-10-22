import PageMedia from "@/components/home/PageMedia";
import SupportRequestForm from "@/components/support/SupportRequestForm";
import { getSiteContent } from "@/lib/site-content";

export default async function ContactPage() {
  const content = await getSiteContent("contact");
  return (
    <main className="min-h-screen bg-black px-5 py-20 text-white sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">{content.eyebrow}</p>
            <h1 className="mt-5 font-serif text-5xl sm:text-6xl">{content.title}</h1>
            <p className="mt-8 text-lg leading-8 text-gray-400">
              Email: {content.email}<br />
              Phone: {content.phoneOne}<br />
              Phone: {content.phoneTwo}<br />
              {content.location}
            </p>
            <PageMedia url={content.mediaUrl} alt={content.mediaAlt} />
          </div>
          <SupportRequestForm heading="Ask a question or request support" />
        </div>
      </div>
    </main>
  );
}