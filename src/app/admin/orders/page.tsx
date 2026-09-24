import AdminWorkspace from "@/components/admin/AdminWorkspace";
import { requireAdminPage } from "@/lib/require-admin-page";
export default async function AdminOrdersPage() { await requireAdminPage(); return <AdminWorkspace section="orders" />; }
