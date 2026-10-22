import Collections from "@/components/home/Collections";
import { getSiteContent } from "@/lib/site-content";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";

export default async function CollectionsPage() {
  await connection();
  const [content, categories] = await Promise.all([
    getSiteContent("home"),
    prisma.category.findMany({
      where: { Product: { some: {} } },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return (
    <main className="bg-black text-white min-h-screen pt-28">

      <Collections content={content} categories={categories} />

    </main>
  );
}