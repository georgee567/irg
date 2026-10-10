import Image from "next/image";

export default function PageMedia({ url, alt }: { url: string; alt: string }) {
  if (!url) return null;

  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) {
    return (
      <video
        src={url}
        controls
        playsInline
        className="mt-12 max-h-[70vh] w-full rounded-2xl object-cover"
      />
    );
  }

  return (
    <div className="relative mt-12 h-[28rem] overflow-hidden rounded-2xl">
      <Image src={url} alt={alt} fill className="object-cover" />
    </div>
  );
}
