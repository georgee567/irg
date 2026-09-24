import AdminWorkspace from "@/components/admin/AdminWorkspace";
import { requireAdminPage } from "@/lib/require-admin-page";
export default async function AdminInventoryPage() { await requireAdminPage(); return <AdminWorkspace section="inventory" />; }
