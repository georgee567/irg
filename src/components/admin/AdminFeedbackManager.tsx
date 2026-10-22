"use client";

import { useCallback, useEffect, useState } from "react";

type FeedbackEntry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  detail: string;
  message: string;
  status: string;
  createdAt: string;
};

type Kind = "reviews" | "support";

export default function AdminFeedbackManager({ kind }: { kind: Kind }) {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");

  const endpoint = kind === "reviews" ? "/api/admin/reviews" : "/api/admin/support";
  const title = kind === "reviews" ? "Customer Reviews" : "Customer Support";

  const loadEntries = useCallback(async (): Promise<FeedbackEntry[]> => {
    const response = await fetch(endpoint, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `Unable to load ${title.toLowerCase()}.`);

    if (kind === "reviews") {
      return payload.reviews.map((review: {
        id: string;
        rating: number;
        title: string;
        body: string;
        status: string;
        createdAt: string;
        User: { name: string; email: string };
        Product: { name: string };
      }) => ({
        id: review.id,
        name: review.User.name,
        email: review.User.email,
        subject: `${review.rating}/5 · ${review.title}`,
        detail: review.Product.name,
        message: review.body,
        status: review.status,
        createdAt: review.createdAt,
      }));
    }
    return payload.requests.map((request: {
      id: string;
      name: string;
      email: string;
      subject: string;
      message: string;
      status: string;
      createdAt: string;
    }) => ({
      id: request.id,
      name: request.name,
      email: request.email,
      subject: request.subject,
      detail: "",
      message: request.message,
      status: request.status,
      createdAt: request.createdAt,
    }));
  }, [endpoint, kind, title]);

  useEffect(() => {
    let active = true;
    loadEntries()
      .then((loadedEntries) => {
        if (active) setEntries(loadedEntries);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : `Unable to load ${title.toLowerCase()}.`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [loadEntries, title]);

  async function updateStatus(id: string, status: string) {
    setBusyId(id);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to update status.");
      setMessage(payload.message);
      setEntries(await loadEntries());
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update status.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <main className="min-h-screen bg-black px-5 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[.35em] text-[#D4AF37]">IRG business control</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{title}</h1>
        {error ? <p role="alert" className="mt-6 text-red-400">{error}</p> : null}
        {message ? <p role="status" className="mt-6 text-[#D4AF37]">{message}</p> : null}
        {loading ? <p className="mt-8 text-gray-400">Loading…</p> : null}
        {!loading && entries.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-[#222] bg-[#090909] p-6 text-gray-400">
            No {kind === "reviews" ? "customer reviews" : "support requests"} yet.
          </p>
        ) : null}
        <div className="mt-8 grid gap-5">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-[#222] bg-[#090909] p-6">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <h2 className="text-xl font-semibold">{entry.subject}</h2>
                  {entry.detail ? <p className="mt-1 text-sm text-[#D4AF37]">{entry.detail}</p> : null}
                  <p className="mt-2 text-sm text-gray-400">{entry.name} · {entry.email}</p>
                  <p className="mt-1 text-xs text-gray-500">{new Date(entry.createdAt).toLocaleString()}</p>
                </div>
                <span className="rounded-full border border-[#333] px-3 py-1 text-xs uppercase tracking-wide text-gray-300">
                  {entry.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-5 whitespace-pre-wrap leading-7 text-gray-300">{entry.message}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {kind === "reviews" ? (
                  <>
                    <button
                      disabled={busyId === entry.id || entry.status === "APPROVED"}
                      onClick={() => void updateStatus(entry.id, "APPROVED")}
                      className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      disabled={busyId === entry.id || entry.status === "REJECTED"}
                      onClick={() => void updateStatus(entry.id, "REJECTED")}
                      className="rounded-lg border border-[#444] px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      disabled={busyId === entry.id || entry.status === "IN_PROGRESS"}
                      onClick={() => void updateStatus(entry.id, "IN_PROGRESS")}
                      className="rounded-lg border border-[#444] px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                      Mark in progress
                    </button>
                    <button
                      disabled={busyId === entry.id || entry.status === "RESOLVED"}
                      onClick={() => void updateStatus(entry.id, "RESOLVED")}
                      className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
