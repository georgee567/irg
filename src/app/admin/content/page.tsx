import SiteContentEditor from "@/components/admin/SiteContentEditor";
import { requireAdminPage } from "@/lib/require-admin-page";

export default async function AdminContentPage() {
  await requireAdminPage();
  return <SiteContentEditor />;
}
