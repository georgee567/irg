import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await prisma.editorialEntry.findFirst({
    where: { type: "JOURNAL", slug, published: true },
  });
  if (!entry) notFound();

  return (
    <main className="min-h-screen bg-black px-5 py-20 text-white sm:px-8 sm:py-28">
      <article className="mx-auto max-w-4xl">
        <Link href="/journal" className="text-sm text-[#D4AF37]">← Journal</Link>
        {entry.publishedAt ? (
          <p className="mt-10 text-xs uppercase tracking-[.25em] text-gray-500">
            {entry.publishedAt.toLocaleDateString()}
          </p>
        ) : null}
        <h1 className="mt-4 font-serif text-4xl sm:text-6xl">{entry.title}</h1>
        <p className="mt-6 text-xl leading-8 text-gray-400">{entry.summary}</p>
        {entry.imageUrl ? (
          <div className="relative mt-10 h-[24rem] overflow-hidden rounded-3xl sm:h-[36rem]">
            <Image src={entry.imageUrl} alt={entry.imageAlt || entry.title} fill priority className="object-cover" />
          </div>
        ) : null}
        <div className="mt-10 space-y-6 text-base leading-8 text-gray-300">
          {entry.body.split(/\r?\n/).filter(Boolean).map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 30)}`}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
