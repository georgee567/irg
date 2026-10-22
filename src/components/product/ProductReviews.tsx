"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { useAuth } from "@/context/AuthContext";

type Review = {
  id: string;
  rating: number;
  title: string;
  body: string;
  customerName: string;
  createdAt: string;
};

export default function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState("5");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadReviews = useCallback(async (): Promise<Review[]> => {
    const response = await fetch(`/api/products/${productId}/reviews`, {
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load reviews.");
    return data.reviews;
  }, [productId]);

  useEffect(() => {
    let active = true;
    loadReviews()
      .then((loadedReviews) => {
        if (active) setReviews(loadedReviews);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load reviews.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [loadReviews]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: Number(rating), title, body }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit review.");
      setTitle("");
      setBody("");
      setMessage(data.message);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit review.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-24" aria-labelledby="product-reviews-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Verified customers</p>
          <h2 id="product-reviews-title" className="mt-3 font-serif text-4xl sm:text-5xl">
            Customer Reviews
          </h2>
        </div>
        <p className="text-sm text-gray-400">
          {reviews.length} approved {reviews.length === 1 ? "review" : "reviews"}
        </p>
      </div>

      {loading ? <p className="mt-8 text-gray-400">Loading reviews…</p> : null}
      {error ? <p role="alert" className="mt-6 text-sm text-red-400">{error}</p> : null}

      {!loading && reviews.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-[#222] bg-[#090909] p-6 text-gray-400">
          No approved reviews yet. Verified customers can share their experience below.
        </p>
      ) : null}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-2xl border border-[#222] bg-[#090909] p-6">
            <p className="text-[#D4AF37]" aria-label={`${review.rating} out of 5 stars`}>
              {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
            </p>
            <h3 className="mt-3 text-lg font-semibold">{review.title}</h3>
            <p className="mt-3 leading-7 text-gray-300">{review.body}</p>
            <p className="mt-5 text-sm text-gray-500">
              {review.customerName} · Verified purchase · {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-[#222] bg-[#090909] p-6 sm:p-8">
        <h3 className="font-serif text-2xl">Share your experience</h3>
        {message ? <p role="status" className="mt-4 text-sm text-[#D4AF37]">{message}</p> : null}
        {user ? (
          <form onSubmit={submitReview} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm text-gray-300">
              Rating
              <select
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                className="rounded-xl border border-[#333] bg-black px-4 py-3 text-white"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>{value} out of 5</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Review title
              <input
                required
                maxLength={120}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="rounded-xl border border-[#333] bg-black px-4 py-3 text-white"
              />
            </label>
            <label className="grid gap-2 text-sm text-gray-300">
              Your review
              <textarea
                required
                maxLength={2000}
                rows={4}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="rounded-xl border border-[#333] bg-black px-4 py-3 text-white"
              />
            </label>
            {error ? <p role="alert" className="text-sm text-red-400">{error}</p> : null}
            <button
              disabled={saving}
              className="w-fit rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-black disabled:opacity-50"
            >
              {saving ? "Submitting…" : "Submit review"}
            </button>
            <p className="text-xs text-gray-500">
              Reviews are accepted from customers with a paid order and published after admin approval.
            </p>
          </form>
        ) : (
          <p className="mt-4 text-gray-400">
            <Link href="/login" className="text-[#D4AF37] underline">Sign in</Link>
            {" "}with the account used for your verified purchase to submit a review.
          </p>
        )}
      </div>
    </section>
  );
}
