"use client";

interface Props {
  payment: string;
  setPayment: (value: string) => void;
}

export default function PaymentMethods({
  payment,
  setPayment,
}: Props) {

  const methods = ["M-Pesa"];

  return (

    <div className="mt-10">

      <h2 className="mb-5 text-2xl font-serif">
        Payment Method
      </h2>

      <div className="grid gap-4">

        {methods.map((method) => (

          <button
            key={method}
            onClick={() => setPayment(method)}
            className={`rounded-xl border p-5 text-left transition ${
              payment === method
                ? "border-[#D4AF37] bg-[#D4AF37]/10"
                : "border-[#222]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{method}</span>
              {payment === method ? <span className="text-sm text-[#D4AF37]">Selected</span> : null}
            </div>
          </button>

        ))}

      </div>

      <p className="mt-4 text-sm text-gray-400">M-Pesa payments are verified by the server callback before an order is marked paid.</p>

    </div>

  );

}