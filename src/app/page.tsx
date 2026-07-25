import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      <AnnouncementBar />
      <Navbar />
      <Hero />
    </main>
  );
}