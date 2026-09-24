import AdminWorkspace from "@/components/admin/AdminWorkspace";
import { requireAdminPage } from "@/lib/require-admin-page";
export default async function AdminSettingsPage() { await requireAdminPage(); return <AdminWorkspace section="settings" />; }
