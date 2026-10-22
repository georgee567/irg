"use client";

import { useState, type FormEvent } from "react";

export default function SupportRequestForm({
  defaultSubject = "",
  heading = "Send us a message",
}: {
  defaultSubject?: string;
  heading?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");
    setError("");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send your message.");
      setName("");
      setEmail("");
      setSubject(defaultSubject);
      setMessage("");
      setFeedback(data.message);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to send your message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-[#222] bg-[#090909] p-6 sm:p-8">
      <h2 className="font-serif text-3xl">{heading}</h2>
      <p className="mt-3 text-sm leading-6 text-gray-400">
        Your message is saved for the IRG team to review and follow up.
      </p>
      {feedback ? <p role="status" className="mt-5 text-sm text-[#D4AF37]">{feedback}</p> : null}
      <form onSubmit={submitRequest} className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm text-gray-300">
          Name
          <input
            required
            maxLength={120}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-xl border border-[#333] bg-black px-4 py-3 text-white"
          />
        </label>
        <label className="grid gap-2 text-sm text-gray-300">
          Email
          <input
            required
            type="email"
            maxLength={254}
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-xl border border-[#333] bg-black px-4 py-3 text-white"
          />
        </label>
        <label className="grid gap-2 text-sm text-gray-300">
          Subject
          <input
            required
            maxLength={160}
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="rounded-xl border border-[#333] bg-black px-4 py-3 text-white"
          />
        </label>
        <label className="grid gap-2 text-sm text-gray-300">
          Message
          <textarea
            required
            maxLength={5000}
            rows={6}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="rounded-xl border border-[#333] bg-black px-4 py-3 text-white"
          />
        </label>
        {error ? <p role="alert" className="text-sm text-red-400">{error}</p> : null}
        <button
          disabled={submitting}
          className="w-fit rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-black disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send message"}
        </button>
      </form>
    </section>
  );
}
