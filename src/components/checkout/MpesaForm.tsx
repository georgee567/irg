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
        After clicking <strong>Place Order</strong>, an STK Push
        request will be sent to your phone.
      </p>

    </div>
  );
}