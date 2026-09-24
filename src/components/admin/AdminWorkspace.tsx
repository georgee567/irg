"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type Section = "dashboard" | "inventory" | "orders" | "customers" | "categories" | "settings";
type Dashboard = { statistics: { users: number; products: number; categories: number; orders: number; revenue: number; lowStock: number; outOfStock: number }; recentOrders: Array<{ id: string; shippingName: string; total: number; status: string; paymentStatus: string; createdAt: string }> };
type InventoryItem = { id: string; size: string; color: string; stock: number; Product: { name: string } };
type Order = { id: string; status: string; paymentStatus: string; total: number; createdAt: string; customer: { name: string; email: string }; items: Array<{ productName: string; quantity: number }> };
type Customer = { id: string; name: string; email: string; role: string; createdAt: string; _count: { Order: number } };
type Category = { id: string; name: string; slug: string; _count: { Product: number } };

const labels: Record<Section, string> = { dashboard: "Dashboard", inventory: "Inventory", orders: "Orders", customers: "Customers", categories: "Categories", settings: "Settings" };

export default function AdminWorkspace({ section }: { section: Section }) {
  const [data, setData] = useState<Dashboard | InventoryItem[] | Order[] | Customer[] | Category[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    if (section === "settings") return;
    setError("");
    const route = section === "dashboard" ? "/api/admin/dashboard" : section === "inventory" ? "/api/admin/inventory" : section === "orders" ? "/api/admin/orders" : section === "customers" ? "/api/admin/users" : "/api/admin/categories";
    const response = await fetch(route, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to load admin data.");
    setData(section === "inventory" ? payload.variants : section === "orders" ? payload.orders : section === "customers" ? payload.users : section === "categories" ? payload.categories : payload);
  }, [section]);

  useEffect(() => {
    void (async () => {
      try {
        await load();
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Unable to load admin data.");
      }
    })();
  }, [load]);

  async function saveStock(item: InventoryItem, stock: string) {
    const value = Number(stock);
    if (!Number.isInteger(value) || value < 0) return setError("Stock must be a non-negative whole number.");
    setBusyId(item.id);
    const response = await fetch(`/api/admin/inventory/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stock: value }) });
    setBusyId("");
    if (!response.ok) return setError((await response.json()).error || "Unable to update stock.");
    await load();
  }
  async function saveOrderStatus(id: string, status: string) {
    setBusyId(id);
    const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setBusyId("");
    if (!response.ok) return setError((await response.json()).error || "Unable to update order.");
    await load();
  }

  return <main className="min-h-screen bg-black px-5 py-12 text-white sm:px-8"><div className="mx-auto max-w-7xl"><div><p className="text-xs uppercase tracking-[.35em] text-[#D4AF37]">IRG business control</p><h1 className="mt-3 font-serif text-5xl">{labels[section]}</h1></div>{error && <p role="alert" className="mt-6 text-red-400">{error}</p>}{section === "settings" ? <section className="mt-10 rounded-3xl border border-[#222] bg-[#090909] p-8"><h2 className="font-serif text-3xl">Store settings</h2><p className="mt-4 max-w-2xl text-gray-400">This foundation deliberately uses no invented business fields. Store contact details, social links, and content can be connected once their approved persistence model is defined.</p></section> : null}{section === "dashboard" && data && <DashboardView data={data as Dashboard} />}{section === "inventory" && <InventoryView items={(data as InventoryItem[]) || []} onSave={saveStock} busyId={busyId} />}{section === "orders" && <OrdersView orders={(data as Order[]) || []} onSave={saveOrderStatus} busyId={busyId} />}{section === "customers" && <CustomersView users={(data as Customer[]) || []} />}{section === "categories" && <CategoriesView categories={(data as Category[]) || []} />}</div></main>;
}

function DashboardView({ data }: { data: Dashboard }) { const cards = [["Products", data.statistics.products], ["Customers", data.statistics.users], ["Orders", data.statistics.orders], ["Paid revenue", `KSh ${data.statistics.revenue.toLocaleString()}`], ["Low stock", data.statistics.lowStock], ["Out of stock", data.statistics.outOfStock]]; return <><section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label, value]) => <div key={String(label)} className="rounded-3xl border border-[#222] bg-[#090909] p-6"><p className="text-xs uppercase tracking-[.2em] text-gray-500">{label}</p><p className="mt-3 font-serif text-3xl text-[#D4AF37]">{value}</p></div>)}</section><section className="mt-8 overflow-x-auto rounded-3xl border border-[#222] bg-[#090909] p-6"><h2 className="font-serif text-3xl">Recent orders</h2><table className="mt-6 w-full min-w-[640px] text-left text-sm"><thead className="text-xs uppercase tracking-[.16em] text-gray-500"><tr><th>Customer</th><th>Status</th><th>Payment</th><th>Total</th><th>Date</th></tr></thead><tbody>{data.recentOrders.map((order) => <tr key={order.id} className="border-t border-[#222]"><td className="py-4">{order.shippingName}</td><td>{order.status}</td><td>{order.paymentStatus}</td><td>KSh {order.total.toLocaleString()}</td><td>{new Date(order.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></section></> }
function InventoryView({ items, onSave, busyId }: { items: InventoryItem[]; onSave: (item: InventoryItem, stock: string) => Promise<void>; busyId: string }) { return <section className="mt-10 overflow-x-auto rounded-3xl border border-[#222] bg-[#090909] p-6"><h2 className="font-serif text-3xl">Variant inventory</h2><table className="mt-6 w-full min-w-[640px] text-left text-sm"><thead className="text-xs uppercase tracking-[.16em] text-gray-500"><tr><th>Product</th><th>Size</th><th>Color</th><th>Stock</th><th>State</th><th></th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t border-[#222]"><td className="py-4">{item.Product.name}</td><td>{item.size}</td><td>{item.color}</td><td><input aria-label={`${item.Product.name} stock`} defaultValue={item.stock} type="number" min="0" className="w-20 rounded border border-[#333] bg-black px-2 py-1" id={`stock-${item.id}`} /></td><td className={item.stock === 0 ? "text-red-400" : item.stock <= 5 ? "text-yellow-300" : "text-green-400"}>{item.stock === 0 ? "Out of stock" : item.stock <= 5 ? "Low stock" : "In stock"}</td><td><button disabled={busyId === item.id} onClick={() => { const element = document.getElementById(`stock-${item.id}`) as HTMLInputElement; onSave(item, element.value); }} className="text-[#D4AF37] disabled:opacity-50">Save</button></td></tr>)}</tbody></table></section> }
function OrdersView({ orders, onSave, busyId }: { orders: Order[]; onSave: (id: string, status: string) => Promise<void>; busyId: string }) { return <section className="mt-10 overflow-x-auto rounded-3xl border border-[#222] bg-[#090909] p-6"><h2 className="font-serif text-3xl">Orders</h2><table className="mt-6 w-full min-w-[820px] text-left text-sm"><thead className="text-xs uppercase tracking-[.16em] text-gray-500"><tr><th>Customer</th><th>Items</th><th>Payment</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-t border-[#222]"><td className="py-4">{order.customer.name}<span className="block text-gray-500">{order.customer.email}</span></td><td>{order.items.map((item) => `${item.productName} ×${item.quantity}`).join(", ")}</td><td>{order.paymentStatus}</td><td>KSh {order.total.toLocaleString()}</td><td><select aria-label={`Status for ${order.id}`} disabled={busyId === order.id} value={order.status} onChange={(event) => onSave(order.id, event.target.value)} className="rounded border border-[#333] bg-black p-2"><option>PENDING</option><option>CONFIRMED</option><option>PROCESSING</option><option>SHIPPED</option><option>DELIVERED</option><option>CANCELLED</option></select></td></tr>)}</tbody></table></section> }
function CustomersView({ users }: { users: Customer[] }) { const [query, setQuery] = useState(""); const visible = users.filter((user) => user.role === "CUSTOMER" && `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())); return <section className="mt-10 overflow-x-auto rounded-3xl border border-[#222] bg-[#090909] p-6"><h2 className="font-serif text-3xl">Customers</h2><input aria-label="Search customers" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or email" className="mt-5 w-full max-w-md rounded border border-[#333] bg-black p-3" /><table className="mt-6 w-full min-w-[640px] text-left text-sm"><thead className="text-xs uppercase tracking-[.16em] text-gray-500"><tr><th>Name</th><th>Email</th><th>Orders</th><th>Joined</th></tr></thead><tbody>{visible.map((user) => <tr key={user.id} className="border-t border-[#222]"><td className="py-4">{user.name}</td><td>{user.email}</td><td>{user._count.Order}</td><td>{new Date(user.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></section> }
function CategoriesView({ categories }: { categories: Category[] }) { const [name, setName] = useState(""); const [slug, setSlug] = useState(""); const [message, setMessage] = useState(""); async function create(event: FormEvent) { event.preventDefault(); const response = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, slug }) }); const data = await response.json(); if (!response.ok) return setMessage(data.error || "Unable to create category."); window.location.reload(); } async function remove(category: Category) { if (!window.confirm(`Delete ${category.name}?`)) return; const response = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" }); const data = await response.json(); if (!response.ok) return setMessage(data.error || "Unable to delete category."); window.location.reload(); } return <section className="mt-10 overflow-x-auto rounded-3xl border border-[#222] bg-[#090909] p-6"><h2 className="font-serif text-3xl">Categories</h2><form onSubmit={create} className="mt-5 flex flex-col gap-3 sm:flex-row"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" className="rounded border border-[#333] bg-black p-3" /><input required value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="slug" className="rounded border border-[#333] bg-black p-3" /><button className="rounded bg-[#D4AF37] px-5 py-3 font-medium text-black">Create</button></form>{message && <p className="mt-3 text-red-400">{message}</p>}<table className="mt-6 w-full min-w-[520px] text-left text-sm"><thead className="text-xs uppercase tracking-[.16em] text-gray-500"><tr><th>Name</th><th>Slug</th><th>Products</th><th></th></tr></thead><tbody>{categories.map((category) => <tr key={category.id} className="border-t border-[#222]"><td className="py-4">{category.name}</td><td>{category.slug}</td><td>{category._count.Product}</td><td>{category._count.Product === 0 && <button onClick={() => remove(category)} className="text-red-400">Delete</button>}</td></tr>)}</tbody></table></section> }
