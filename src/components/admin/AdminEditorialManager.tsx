"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type EditorialType = "LOOKBOOK" | "JOURNAL";
type Entry = {
  id: string;
  type: EditorialType;
  title: string;
  slug: string;
  summary: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  published: boolean;
  productId: string | null;
  Product: { id: string; name: string; slug: string } | null;
};
type ProductOption = { id: string; name: string };
type EntryDraft = Omit<Entry, "id" | "Product">;

const emptyDraft: EntryDraft = {
  type: "JOURNAL",
  title: "",
  slug: "",
  summary: "",
  body: "",
  imageUrl: "",
  imageAlt: "",
  published: false,
  productId: null,
};

export default function AdminEditorialManager() {
  const [type, setType] = useState<EditorialType>("JOURNAL");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [draft, setDraft] = useState<EntryDraft>(emptyDraft);
  const [editingId, setEditingId] = useState("");
  const [loadedType, setLoadedType] = useState<EditorialType | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const [entriesResponse, productsResponse] = await Promise.all([
      fetch(`/api/admin/editorial?type=${type}`, { cache: "no-store" }),
      fetch("/api/products", { cache: "no-store" }),
    ]);
    const [entriesData, productsData] = await Promise.all([
      entriesResponse.json(),
      productsResponse.json(),
    ]);
    if (!entriesResponse.ok) throw new Error(entriesData.error || "Unable to load editorial entries.");
    if (!productsResponse.ok) throw new Error(productsData.error || "Unable to load products.");
    return {
      entries: entriesData.entries as Entry[],
      products: (productsData.products as ProductOption[]).map(({ id, name }) => ({ id, name })),
    };
  }, [type]);

  useEffect(() => {
    let active = true;
    void load()
      .then((data) => {
        if (!active) return;
        setEntries(data.entries);
        setProducts(data.products);
        setLoadedType(type);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Unable to load editorial entries.");
      })
      .finally(() => { if (active) setLoadedType(type); });
    return () => { active = false; };
  }, [load, type]);

  function resetForm() {
    setDraft({ ...emptyDraft, type });
    setEditingId("");
  }

  function edit(entry: Entry) {
    setDraft({
      type: entry.type,
      title: entry.title,
      slug: entry.slug,
      summary: entry.summary,
      body: entry.body,
      imageUrl: entry.imageUrl,
      imageAlt: entry.imageAlt,
      published: entry.published,
      productId: entry.productId,
    });
    setEditingId(entry.id);
    setMessage("");
    setError("");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(
        editingId ? `/api/admin/editorial/${editingId}` : "/api/admin/editorial",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save entry.");
      setMessage(editingId ? "Editorial entry updated." : "Editorial entry created.");
      resetForm();
      const result = await load();
      setEntries(result.entries);
      setProducts(result.products);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save entry.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(entry: Entry) {
    if (!window.confirm(`Delete "${entry.title}"?`)) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/editorial/${entry.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete entry.");
      setMessage(data.message);
      if (editingId === entry.id) resetForm();
      const result = await load();
      setEntries(result.entries);
      setProducts(result.products);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to delete entry.");
    } finally {
      setBusy(false);
    }
  }

  function update<K extends keyof EntryDraft>(key: K, value: EntryDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-black px-5 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[.35em] text-[#D4AF37]">Editorial content</p>
        <h1 className="mt-3 font-serif text-5xl">Lookbook &amp; Journal</h1>
        <p className="mt-4 max-w-3xl text-gray-400">
          Create genuine IRG campaign and editorial entries. Only published entries appear publicly.
        </p>

        <label className="mt-8 block max-w-sm text-sm text-gray-300">
          Content type
          <select
            value={type}
            onChange={(event) => {
              const value = event.target.value as EditorialType;
              setType(value);
              setDraft({ ...emptyDraft, type: value });
              setEditingId("");
            }}
            className="mt-2 w-full rounded-lg border border-[#333] bg-[#090909] px-4 py-3"
          >
            <option value="JOURNAL">Journal article</option>
            <option value="LOOKBOOK">Lookbook entry</option>
          </select>
        </label>

        {error ? <p role="alert" className="mt-5 rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-300">{error}</p> : null}
        {message ? <p role="status" className="mt-5 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-4 text-[#D4AF37]">{message}</p> : null}

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <form onSubmit={save} className="space-y-5 rounded-2xl border border-[#292929] bg-[#090909] p-6">
            <h2 className="font-serif text-3xl">{editingId ? "Edit entry" : "Create entry"}</h2>
            <label className="block text-sm text-gray-300">
              Title
              <input required maxLength={180} value={draft.title} onChange={(event) => update("title", event.target.value)} className="mt-2 w-full rounded-lg border border-[#333] bg-black px-4 py-3" />
            </label>
            <label className="block text-sm text-gray-300">
              URL slug
              <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={180} value={draft.slug} onChange={(event) => update("slug", event.target.value)} className="mt-2 w-full rounded-lg border border-[#333] bg-black px-4 py-3" />
            </label>
            <label className="block text-sm text-gray-300">
              Summary
              <textarea required maxLength={600} rows={3} value={draft.summary} onChange={(event) => update("summary", event.target.value)} className="mt-2 w-full rounded-lg border border-[#333] bg-black px-4 py-3" />
            </label>
            <label className="block text-sm text-gray-300">
              {type === "JOURNAL" ? "Article body" : "Story / campaign details"}
              <textarea required maxLength={30000} rows={10} value={draft.body} onChange={(event) => update("body", event.target.value)} className="mt-2 w-full rounded-lg border border-[#333] bg-black px-4 py-3" />
            </label>
            <label className="block text-sm text-gray-300">
              Image URL (optional)
              <input type="url" maxLength={2048} value={draft.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} placeholder="Paste an uploaded Vercel Blob URL" className="mt-2 w-full rounded-lg border border-[#333] bg-black px-4 py-3" />
            </label>
            {draft.imageUrl ? (
              <label className="block text-sm text-gray-300">
                Image description
                <input maxLength={250} value={draft.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} className="mt-2 w-full rounded-lg border border-[#333] bg-black px-4 py-3" />
              </label>
            ) : null}
            {type === "LOOKBOOK" ? (
              <label className="block text-sm text-gray-300">
                Linked product (optional)
                <select value={draft.productId ?? ""} onChange={(event) => update("productId", event.target.value || null)} className="mt-2 w-full rounded-lg border border-[#333] bg-black px-4 py-3">
                  <option value="">No linked product</option>
                  {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                </select>
              </label>
            ) : null}
            <label className="flex items-center gap-3 text-sm text-gray-300">
              <input type="checkbox" checked={draft.published} onChange={(event) => update("published", event.target.checked)} />
              Publish this entry
            </label>
            <div className="flex flex-wrap gap-3">
              <button disabled={busy} className="rounded-full bg-[#D4AF37] px-6 py-3 font-semibold text-black disabled:opacity-50">
                {busy ? "Saving…" : editingId ? "Save changes" : "Create entry"}
              </button>
              {editingId ? <button type="button" onClick={resetForm} className="rounded-full border border-[#444] px-6 py-3">Cancel edit</button> : null}
            </div>
          </form>

          <section className="rounded-2xl border border-[#292929] bg-[#090909] p-6">
            <h2 className="font-serif text-3xl">Saved {type === "JOURNAL" ? "articles" : "lookbook entries"}</h2>
            {loadedType !== type ? <p className="mt-5 text-gray-400">Loading entries…</p> : null}
            {loadedType === type && entries.length === 0 ? <p className="mt-5 text-gray-400">No entries yet. Create one when you have genuine IRG content ready.</p> : null}
            <ul className="mt-5 space-y-4">
              {entries.map((entry) => (
                <li key={entry.id} className="rounded-xl border border-[#222] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{entry.title}</h3>
                      <p className="mt-1 text-xs text-gray-500">/{type.toLowerCase()}/{entry.slug} · {entry.published ? "Published" : "Draft"}</p>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => edit(entry)} className="text-sm text-[#D4AF37]">Edit</button>
                      <button type="button" disabled={busy} onClick={() => void remove(entry)} className="text-sm text-red-400 disabled:opacity-50">Delete</button>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-gray-400">{entry.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
