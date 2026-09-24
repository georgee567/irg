import AdminNavigation from "@/components/admin/AdminNavigation";
import { requireAdminPage } from "@/lib/require-admin-page";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();

  return (
    <>
      <header className="border-b border-[#222] bg-black px-5 py-6 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs uppercase tracking-[.35em] text-[#D4AF37]">IRG Admin</p>
          <AdminNavigation />
        </div>
      </header>
      {children}
    </>
  );
}
