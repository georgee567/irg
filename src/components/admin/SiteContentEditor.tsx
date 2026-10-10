"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useMemo, useState } from "react";

type PageEntry = {
  page: string;
  defaults: Record<string, string>;
  content: Record<string, string>;
};

const acceptedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function labelFor(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

export default function SiteContentEditor() {
  const [entries, setEntries] = useState<PageEntry[]>([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const selected = useMemo(
    () => entries.find((entry) => entry.page === selectedPage),
    [entries, selectedPage],
  );

  useEffect(() => {
    let active = true;
    fetch("/api/admin/content", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Unable to load site content.");
        return data.pages as PageEntry[];
      })
      .then((pages) => {
        if (!active) return;
        setEntries(pages);
        setSelectedPage(pages[0]?.page ?? "");
        setDraft(pages[0]?.content ?? null);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load site content.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function saveContent() {
    setError("");
    setMessage("");
    if (!draft) {
      setError("Page content has not finished loading.");
      return;
    }
    const content = draft;

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: selectedPage, content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to save site content.");
      setEntries((current) => current.map((entry) =>
        entry.page === selectedPage ? { ...entry, content } : entry,
      ));
      setMessage(data.message);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save site content.");
    }
  }

  async function uploadMedia(file: File) {
    setError("");
    setMessage("");
    if (!acceptedTypes.has(file.type)) {
      setError("Choose a JPEG, PNG, WebP, AVIF, MP4, WebM, or MOV file.");
      return;
    }
    if (file.size === 0 || file.size > 100 * 1024 * 1024) {
      setError("Media files must be between 1 byte and 100 MB.");
      return;
    }

    const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "media";
    setUploadProgress(0);
    try {
      const result = await upload(
        `site-content/${crypto.randomUUID()}.${extension}`,
        file,
        {
          access: "public",
          handleUploadUrl: "/api/admin/content/upload",
          contentType: file.type,
          multipart: file.size > 5 * 1024 * 1024,
          onUploadProgress: ({ percentage }) => setUploadProgress(percentage),
        },
      );
      setMediaUrl(result.url);
      setMessage("Upload complete. Copy the URL into the matching image or media field, then save that page.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload media.");
    } finally {
      setUploadProgress(null);
    }
  }

  async function copyMediaUrl() {
    try {
      await navigator.clipboard.writeText(mediaUrl);
      setMessage("Media URL copied.");
    } catch (copyError) {
      setError(copyError instanceof Error ? copyError.message : "Unable to copy the media URL.");
    }
  }

  function resetToDefaults() {
    if (!selected) return;
    setDraft(selected.defaults);
    setMessage("Defaults loaded in the editor. Save to publish them.");
    setError("");
  }

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Website editor</p>
        <h1 className="mt-3 font-serif text-4xl text-white">Manage Site Content</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
          Edit the text and media URLs used across the public pages. Upload images or videos here
          (up to 100 MB), then copy the URL into the relevant field before saving.
        </p>
      </div>

      {loading ? <p className="text-gray-400">Loading site content…</p> : null}
      {error ? <p role="alert" className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-300">{error}</p> : null}
      {message ? <p role="status" className="rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-4 text-[#D4AF37]">{message}</p> : null}

      {selected ? (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-5 rounded-2xl border border-[#292929] bg-[#090909] p-6">
            <label className="block text-sm text-gray-300">
              Page
              <select
                value={selectedPage}
                onChange={(event) => {
                  const page = event.target.value;
                  const entry = entries.find((item) => item.page === page);
                  setSelectedPage(page);
                  setDraft(entry?.content ?? null);
                  setMessage("");
                  setError("");
                }}
                className="mt-2 w-full rounded-lg border border-[#333] bg-black px-4 py-3 text-white"
              >
                {entries.map((entry) => (
                  <option key={entry.page} value={entry.page}>
                    {labelFor(entry.page)}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <p className="mb-3 text-sm text-gray-300">Edit text, links, or media URLs</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(selected.defaults).map(([key, value]) => (
                  <label key={key} className="block rounded-lg border border-[#292929] p-3 text-xs text-gray-400">
                    {labelFor(key)}
                    <textarea
                      value={draft?.[key] ?? selected.content[key] ?? value}
                      onChange={(event) => setDraft((current) => ({
                        ...(current ?? selected.content),
                        [key]: event.target.value,
                      }))}
                      rows={key.toLowerCase().includes("description") ? 4 : 2}
                      className="mt-2 w-full resize-y rounded-md border border-[#333] bg-black p-3 text-sm text-white"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={saveContent} className="rounded-lg bg-[#D4AF37] px-5 py-3 font-semibold text-black hover:bg-[#e4c65d]">
                Save Changes
              </button>
              <button onClick={resetToDefaults} className="rounded-lg border border-[#444] px-5 py-3 text-gray-200 hover:border-[#D4AF37]">
                Load Defaults
              </button>
            </div>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border border-[#292929] bg-[#090909] p-6">
            <h2 className="font-serif text-2xl text-white">Upload media</h2>
            <p className="text-sm leading-6 text-gray-400">
              Supported images: JPEG, PNG, WebP, AVIF. Videos: MP4, WebM, MOV. Maximum file size: 100 MB.
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
              disabled={uploadProgress !== null}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadMedia(file);
                event.currentTarget.value = "";
              }}
              className="block w-full text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-[#D4AF37] file:px-4 file:py-2 file:font-semibold file:text-black"
            />
            {uploadProgress !== null ? (
              <p role="status" className="text-sm text-[#D4AF37]">Uploading: {uploadProgress}%</p>
            ) : null}
            {mediaUrl ? (
              <div className="space-y-3">
                <p className="break-all rounded-lg bg-black p-3 text-xs text-gray-300">{mediaUrl}</p>
                <button onClick={copyMediaUrl} className="rounded-lg border border-[#444] px-4 py-2 text-sm text-white hover:border-[#D4AF37]">
                  Copy media URL
                </button>
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}
    </section>
  );
}
