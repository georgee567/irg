import BrandStory from "@/components/home/BrandStory";
import WhyChoose from "@/components/home/WhyChoose";
import AdminPanel from "@/components/admin/AdminPanel";

export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <BrandStory />
      <WhyChoose />
      <div className="mx-auto max-w-7xl px-8 pb-24">
        <AdminPanel />
      </div>
    </main>
  );
}