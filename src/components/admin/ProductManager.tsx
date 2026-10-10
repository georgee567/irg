"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";

import { useAuth } from "@/context/AuthContext";

type Category = { id: string; name: string };
type Variant = { id?: string; size: string; color: string; price: string; stock: string };
type Product = { id: string; name: string; slug: string; description: string; price: number; images: string[]; featured: boolean; categoryId: string; category?: Category; variants: Variant[] };
const blankVariant = (): Variant => ({ size: "", color: "", price: "", stock: "0" });

export default function ProductManager() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", price: "", categoryId: "", featured: false, images: [""] });
  const [variants, setVariants] = useState<Variant[]>([blankVariant()]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const [productResponse, categoryResponse] = await Promise.all([fetch("/api/admin/products"), fetch("/api/admin/categories")]);
    if (!productResponse.ok) throw new Error((await productResponse.json()).error || "Admin access required.");
    const productData = await productResponse.json();
    const categoryData = await categoryResponse.json();
    setProducts(productData.products);
    setCategories(categoryData.categories || []);
    if (categoryData.categories?.length) {
      setForm((current) => ({
        ...current,
        categoryId: current.categoryId || categoryData.categories[0].id,
      }));
    }
  }

  useEffect(() => {
    if (!loading && user?.role === "ADMIN") {
      void (async () => {
        try {
          await load();
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "Unable to load products.");
        }
      })();
    }
  }, [loading, user]);

  function startNew() {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", price: "", categoryId: categories[0]?.id || "", featured: false, images: [""] });
    setVariants([blankVariant()]);
    setMessage("");
    setError("");
  }

  function startEdit(product: Product) {
    setEditing(product);
    setForm({ name: product.name, slug: product.slug, description: product.description, price: String(product.price), categoryId: product.categoryId, featured: product.featured, images: product.images.length ? product.images : [""] });
    setVariants(product.variants.map((variant) => ({ ...variant, price: String(variant.price), stock: String(variant.stock) })));
    setMessage("");
    setError("");
  }

  function updateVariant(index: number, field: keyof Variant, value: string) {
    setVariants((current) => current.map((variant, variantIndex) => variantIndex === index ? { ...variant, [field]: value } : variant));
  }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));
      const response = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to upload images.");
        return;
      }
      setForm((current) => ({ ...current, images: [...current.images.filter(Boolean), ...data.urls] }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to upload images.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, images: form.images.filter(Boolean), variants: variants.filter((variant) => variant.size || variant.color || variant.price).map((variant) => ({ ...variant, stock: Number(variant.stock || 0) })) };
      const response = await fetch(editing ? `/api/admin/products/${editing.id}` : "/api/admin/products", { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to save product.");
        return;
      }
      await load();
      const savedMessage = editing ? "Product updated." : "Product added.";
      startNew();
      setMessage(savedMessage);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(product: Product) {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) { setError(data.error); return; }
    setMessage("Product deleted.");
    await load();
    if (editing?.id === product.id) startNew();
  }

  if (loading) return <section className="mx-auto max-w-7xl px-8 py-24 text-white">Loading admin access...</section>;
  if (!user || user.role !== "ADMIN") return <section className="mx-auto max-w-7xl px-8 py-24 text-white"><h1 className="font-serif text-5xl">Admin access required</h1><p className="mt-4 text-gray-400">Sign in with an authenticated ADMIN account to manage products.</p></section>;

  return (
    <section className="mx-auto max-w-7xl px-8 py-24 text-white">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">IRG Admin</p><h1 className="mt-4 font-serif text-5xl">Products</h1></div><button type="button" onClick={startNew} className="rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-black">+ Add New Product</button></div>
      <p className="mt-4 max-w-2xl text-gray-400">Select product images from your computer. They are uploaded to the configured product image storage and saved with the product.</p>
      {message && <p className="mt-6 text-[#D4AF37]">{message}</p>}
      <form onSubmit={submit} className="mt-10 space-y-6 rounded-[24px] border border-[#222] bg-[#090909] p-8"><h2 className="font-serif text-3xl">{editing ? "Edit product" : "Add product"}</h2><div className="grid gap-5 md:grid-cols-2">{([["name", "Product name"], ["slug", "Product slug"], ["price", "Price (KES)"]] as const).map(([field, label]) => <label key={field} className="space-y-2 text-sm text-gray-400">{label}<input required type={field === "price" ? "number" : "text"} min={field === "price" ? "0" : undefined} step={field === "price" ? "0.01" : undefined} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="w-full rounded-lg border border-[#333] bg-black px-4 py-3 text-white" /></label>)}<label className="space-y-2 text-sm text-gray-400">Category<select required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} className="w-full rounded-lg border border-[#333] bg-black px-4 py-3 text-white"><option value="" disabled>Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label></div><label className="block space-y-2 text-sm text-gray-400">Description<textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-28 w-full rounded-lg border border-[#333] bg-black px-4 py-3 text-white" /></label><label className="flex items-center gap-3 text-sm text-gray-300"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Featured product</label>
        <div><p className="mb-2 text-sm text-gray-400">Product images</p><input aria-label="Upload product images" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={uploading} onChange={(event) => uploadImages(event.target.files)} className="mb-4 block text-sm text-gray-300 disabled:opacity-50" /><p className="mb-3 text-xs text-gray-500">JPEG, PNG, WebP, or AVIF; maximum 5 MB per image.</p>{uploading && <p className="mb-3 text-sm text-[#D4AF37]">Uploading image...</p>}{form.images.map((image, index) => <div className="mb-3 flex items-center gap-3" key={image || index}>{image ? <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-[#333]"><Image src={image} alt="Product preview" fill className="object-cover" sizes="64px" /></div> : null}<input value={image} onChange={(event) => setForm({ ...form, images: form.images.map((current, currentIndex) => currentIndex === index ? event.target.value : current) })} placeholder="Uploaded image URL" className="w-full rounded-lg border border-[#333] bg-black px-4 py-3 text-white" />{form.images.length > 1 && <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, currentIndex) => currentIndex !== index) })} className="px-3 text-red-400">Remove</button>}</div>)}<button type="button" onClick={() => setForm({ ...form, images: [...form.images, ""] })} className="text-sm text-[#D4AF37]">+ Add image URL</button></div>
        <div><p className="mb-2 text-sm text-gray-400">Variants</p>{variants.map((variant, index) => <div className="mb-2 grid gap-2 md:grid-cols-4" key={index}>{(["size", "color", "price", "stock"] as const).map((field) => <input key={field} required type={field === "price" || field === "stock" ? "number" : "text"} min={field === "price" || field === "stock" ? "0" : undefined} step={field === "stock" ? "1" : field === "price" ? "0.01" : undefined} placeholder={field[0].toUpperCase() + field.slice(1)} value={variant[field]} onChange={(event) => updateVariant(index, field, event.target.value)} className="rounded-lg border border-[#333] bg-black px-4 py-3 text-white" />)}</div>)}<button type="button" onClick={() => setVariants([...variants, blankVariant()])} className="text-sm text-[#D4AF37]">+ Add variant</button></div>
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={uploading || saving} className="rounded-xl bg-[#D4AF37] px-8 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50">{uploading ? "Uploading image..." : saving ? "Saving..." : editing ? "Save changes" : "Create product"}</button>
      </form>
      <div className="mt-10 overflow-x-auto rounded-[24px] border border-[#222] bg-[#090909]"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-[#222] text-xs uppercase tracking-[0.2em] text-gray-500"><tr><th className="p-5">Product</th><th>Price</th><th>Category</th><th>Stock</th><th>Featured</th><th className="p-5">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-b border-[#222] last:border-0"><td className="flex items-center gap-4 p-5"><div className="relative h-16 w-16 bg-black">{product.images[0] && <Image src={product.images[0]} alt={product.name} fill className="object-contain" sizes="64px" />}</div><span>{product.name}</span></td><td>KES {Number(product.price).toLocaleString()}</td><td>{product.category?.name || "-"}</td><td>{product.variants.reduce((total, variant) => total + Number(variant.stock), 0)}</td><td>{product.featured ? "Yes" : "No"}</td><td className="p-5"><button type="button" onClick={() => startEdit(product)} className="mr-4 text-[#D4AF37]">Edit</button><button type="button" onClick={() => remove(product)} className="text-red-400">Delete</button></td></tr>)}</tbody></table></div>
    </section>
  );
}
