"use client";

export default function AdminPanel() {
  return (
    <section className="rounded-[32px] border border-[#222] bg-[#090909] p-8">
      <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">Admin Preview</p>
      <h2 className="mt-4 font-serif text-3xl text-white">Inventory & Operations Overview</h2>
      <p className="mt-4 text-gray-400">
        This frontend panel prepares the structure for product management, stock visibility, pricing, and order oversight once the backend is added.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#222] bg-black p-5">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Products</p>
          <p className="mt-3 text-3xl font-semibold text-[#D4AF37]">4</p>
        </div>
        <div className="rounded-2xl border border-[#222] bg-black p-5">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Stock</p>
          <p className="mt-3 text-3xl font-semibold text-[#D4AF37]">Live preview</p>
        </div>
        <div className="rounded-2xl border border-[#222] bg-black p-5">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Orders</p>
          <p className="mt-3 text-3xl font-semibold text-[#D4AF37]">Local demo</p>
        </div>
      </div>
    </section>
  );
}
