import ProductManager from "@/components/admin/ProductManager";
import { requireAdminPage } from "@/lib/require-admin-page";

export default async function AdminProductsPage() {
  await requireAdminPage();
  return <ProductManager />;
}
