import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSiteContent } from "@/lib/site-content";

export default async function JournalPage() {
  await connection();
  const [content, entries] = await Promise.all([
    getSiteContent("journal"),
    prisma.editorialEntry.findMany({
      where: { type: "JOURNAL", published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        imageUrl: true,
        imageAlt: true,
        publishedAt: true,
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">{content.eyebrow}</p>
        <h1 className="mt-5 font-serif text-5xl sm:text-6xl">{content.title}</h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-400">{content.description}</p>

        {entries.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-[#222] bg-[#090909] p-8 text-gray-400">
            No journal articles have been published yet.
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => (
              <article key={entry.id} className="overflow-hidden rounded-3xl border border-[#222] bg-[#090909]">
                {entry.imageUrl ? (
                  <Link href={`/journal/${entry.slug}`} className="relative block h-72">
                    <Image src={entry.imageUrl} alt={entry.imageAlt || entry.title} fill className="object-cover" />
                  </Link>
                ) : null}
                <div className="p-7">
                  {entry.publishedAt ? (
                    <p className="text-xs uppercase tracking-[.2em] text-gray-500">
                      {entry.publishedAt.toLocaleDateString()}
                    </p>
                  ) : null}
                  <h2 className="mt-3 font-serif text-2xl">{entry.title}</h2>
                  <p className="mt-4 leading-7 text-gray-400">{entry.summary}</p>
                  <Link href={`/journal/${entry.slug}`} className="mt-6 inline-flex text-sm uppercase tracking-[.16em] text-[#D4AF37]">
                    Read article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
