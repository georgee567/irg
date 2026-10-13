import Header from "./Header";
import Footer from "../home/Footer";
import AssistantWidget from "./AssistantWidget";
import { getSiteContent } from "@/lib/site-content";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const assistantContent = await getSiteContent("assistant");

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AssistantWidget
        assistantName={assistantContent.assistantName}
        welcomeMessage={assistantContent.welcomeMessage}
      />
    </div>
  );
}
