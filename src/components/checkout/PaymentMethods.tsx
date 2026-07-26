"use client";

interface Props {
  payment: string;
  setPayment: (value: string) => void;
}

export default function PaymentMethods({
  payment,
  setPayment,
}: Props) {

  const methods = [
    "M-Pesa",
    "Visa",
    "Mastercard",
    "PayPal",
  ];

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
            {method}
          </button>

        ))}

      </div>

    </div>

  );

}