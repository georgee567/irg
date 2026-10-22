import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSiteContent } from "@/lib/site-content";

export default async function LookbookPage() {
  await connection();
  const [content, entries] = await Promise.all([
    getSiteContent("lookbook"),
    prisma.editorialEntry.findMany({
      where: { type: "LOOKBOOK", published: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        Product: { select: { id: true, name: true, slug: true } },
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
            New IRG lookbook stories will be published here.
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {entries.map((entry) => (
              <article key={entry.id} className="overflow-hidden rounded-3xl border border-[#222] bg-[#090909]">
                {entry.imageUrl ? (
                  <div className="relative h-[28rem]">
                    <Image src={entry.imageUrl} alt={entry.imageAlt || entry.title} fill className="object-cover" />
                  </div>
                ) : null}
                <div className="p-7 sm:p-9">
                  <h2 className="font-serif text-3xl">{entry.title}</h2>
                  <p className="mt-4 leading-7 text-gray-400">{entry.summary}</p>
                  <p className="mt-4 whitespace-pre-line leading-7 text-gray-300">{entry.body}</p>
                  {entry.Product ? (
                    <Link href={`/product/${entry.Product.id}`} className="mt-6 inline-flex text-sm uppercase tracking-[.16em] text-[#D4AF37] underline underline-offset-4">
                      Shop {entry.Product.name}
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
