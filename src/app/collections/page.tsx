import Collections from "@/components/home/Collections";
import { getSiteContent } from "@/lib/site-content";

export default async function CollectionsPage() {
  const content = await getSiteContent("home");
  return (
    <main className="bg-black text-white min-h-screen pt-28">

      <Collections content={content} />

    </main>
  );
}