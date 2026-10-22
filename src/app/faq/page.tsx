import Link from "next/link";

import { getSiteContent } from "@/lib/site-content";

export default async function FAQPage() {
  const content = await getSiteContent("faq");
  const questionNumbers = [
    "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
  ];
  const questions = questionNumbers.map((number) => {
    return {
      question: content[`question${number}`],
      answer: content[`answer${number}`],
    };
  }).filter((item) => item.question.trim() && item.answer.trim());

  return (
    <main className="min-h-screen bg-black px-5 py-20 text-white sm:px-8 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">{content.eyebrow}</p>
        <h1 className="mt-5 font-serif text-4xl sm:text-6xl">{content.title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg">{content.description}</p>

        <div className="mt-12 space-y-4">
          {questions.map((item) => (
            <details key={item.question} className="group rounded-2xl border border-[#222] bg-[#090909] p-6">
              <summary className="cursor-pointer list-none pr-8 font-semibold marker:hidden">
                <span className="flex items-center justify-between gap-5">
                  {item.question}
                  <span aria-hidden="true" className="text-xl text-[#D4AF37] transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-5 leading-7 text-gray-400">{item.answer}</p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-gray-400">
          Still need help?{" "}
          <Link href="/contact" className="text-[#D4AF37] underline underline-offset-4">Contact IRG support</Link>.
        </p>
      </div>
    </main>
  );
}
