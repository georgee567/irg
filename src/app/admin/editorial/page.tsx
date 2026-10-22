import AdminEditorialManager from "@/components/admin/AdminEditorialManager";
import { requireAdminPage } from "@/lib/require-admin-page";

export default async function AdminEditorialPage() {
  await requireAdminPage();
  return <AdminEditorialManager />;
}
