"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function MpesaForm({ value, onChange }: Props) {
  return (
    <div className="mt-8 rounded-2xl border border-[#222] bg-[#090909] p-6">

      <h3 className="mb-5 text-2xl font-serif">
        M-Pesa Payment
      </h3>

      <input
        type="tel"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="2547XXXXXXXX"
        className="w-full rounded-xl border border-[#222] bg-black p-4 outline-none"
      />

      <p className="mt-4 text-sm text-gray-400">
        Daraja Sandbox testing only. No live merchant account or real payment
        is used. The sandbox STK Push is sent after clicking{" "}
        <strong>Place Order</strong>.
      </p>

    </div>
  );
}