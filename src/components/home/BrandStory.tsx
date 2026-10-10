"use client";

import type { SiteContent } from "@/lib/site-content";

export default function BrandStory({ content }: { content: SiteContent }) {
  return (
    <section className="bg-[#050505] py-28">

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-8 lg:grid-cols-2">

        <div>

          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            {content.storyEyebrow}
          </p>

          <h2 className="mt-5 font-serif text-5xl text-white">
            {content.storyTitle}
          </h2>

        </div>

        <div>

          <p className="text-lg leading-9 text-gray-400">
            {content.storyDescription}
          </p>

        </div>

      </div>

    </section>
  );
}