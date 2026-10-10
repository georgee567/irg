export default function AnnouncementBar({ message }: { message: string }) {
  return (
    <div className="fixed top-0 left-0 z-50 w-full border-b border-[#1d1d1d] bg-black">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-6">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]">
          {message}
        </p>
      </div>
    </div>
  );
}