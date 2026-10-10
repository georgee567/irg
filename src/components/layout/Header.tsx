import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import { getSiteContent } from "@/lib/site-content";

export default async function Header() {
  const content = await getSiteContent("header");
  return (
    <>
      <AnnouncementBar message={content.announcementText} />
      <Navbar content={content} />
    </>
  );
}