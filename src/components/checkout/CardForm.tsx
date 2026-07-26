"use client";

export default function CardForm() {
  return (
    <div className="mt-8 rounded-2xl border border-[#222] bg-[#090909] p-6">

      <h3 className="mb-5 text-2xl font-serif">
        Card Details
      </h3>

      <div className="space-y-4">

        <input
          placeholder="Card Holder Name"
          className="w-full rounded-xl border border-[#222] bg-black p-4 outline-none"
        />

        <input
          placeholder="Card Number"
          className="w-full rounded-xl border border-[#222] bg-black p-4 outline-none"
        />

        <div className="grid grid-cols-2 gap-4">

          <input
            placeholder="MM / YY"
            className="rounded-xl border border-[#222] bg-black p-4 outline-none"
          />

          <input
            placeholder="CVV"
            className="rounded-xl border border-[#222] bg-black p-4 outline-none"
          />

        </div>

      </div>

    </div>
  );
}