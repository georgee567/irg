"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, LoaderCircle, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

function renderMessage(content: string) {
  return content.split(/(\[[^\]]+\]\((?:https:\/\/[^)\s]+|\/(?!\/)[^)\s]*)\))/g).map((part, index) => {
    const link = /^\[([^\]]+)\]\((https:\/\/[^)\s]+|\/(?!\/)[^)\s]*)\)$/.exec(part);
    if (!link) return <span key={index}>{part}</span>;

    const external = link[2].startsWith("https://");
    return (
      <a
        key={index}
        href={link[2]}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="text-[#D4AF37] underline underline-offset-2"
      >
        {link[1]}
      </a>
    );
  });
}

export default function AssistantWidget({
  assistantName,
  welcomeMessage,
}: {
  assistantName: string;
  welcomeMessage: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: welcomeMessage },
  ]);
  const conversationEnd = useRef<HTMLDivElement>(null);
  const messageInput = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    conversationEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) messageInput.current?.focus();
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  async function sendMessage(event?: FormEvent<HTMLFormElement>, suggestedMessage?: string) {
    event?.preventDefault();
    const content = (suggestedMessage ?? draft).trim();
    if (!content || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const conversation = [...messages, userMessage];
    setMessages(conversation.slice(-20));
    setDraft("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation.slice(-12).map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
      });
      const data: unknown = await response.json();
      if (typeof data !== "object" || data === null) {
        throw new Error("Unable to get a reply right now.");
      }
      if (!response.ok) {
        const message =
          "error" in data && typeof data.error === "string"
            ? data.error
            : "Unable to get a reply right now.";
        throw new Error(message);
      }
      if (!("reply" in data) || typeof data.reply !== "string") {
        throw new Error("Unable to get a reply right now.");
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      };
      setMessages((current) => [...current, assistantMessage].slice(-20));
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unable to get a reply right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open ? (
        <section
          role="dialog"
          aria-label={`${assistantName} chat`}
          className="flex h-[min(36rem,calc(100dvh-6rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-[#090909] shadow-2xl shadow-black/70"
        >
          <header className="flex items-center justify-between border-b border-white/10 bg-[#111] px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
                <Bot size={21} aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-white">{assistantName}</p>
                <p className="text-xs text-gray-400">IRG customer support</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant chat"
              className="rounded-full p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </header>

          <div
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="flex-1 space-y-4 overflow-y-auto p-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-sm bg-[#D4AF37] text-black"
                      : "rounded-bl-sm bg-white/8 text-gray-200"
                  }`}
                >
                  {renderMessage(message.content)}
                </p>
              </div>
            ))}
            {messages.length === 1 && !loading ? (
              <div className="flex flex-wrap gap-2">
                {["What can I shop?", "Where are you based?", "How do I get help with an order?"].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(undefined, prompt)}
                    className="rounded-full border border-white/15 px-3 py-2 text-left text-xs text-gray-300 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400" role="status">
                <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
                IRG is thinking…
              </div>
            ) : null}
            <div ref={conversationEnd} />
          </div>

          {error ? (
            <p role="alert" className="mx-4 mb-2 rounded-lg bg-red-950/60 px-3 py-2 text-xs leading-5 text-red-200">
              {error}
            </p>
          ) : null}

          <form onSubmit={(event) => void sendMessage(event)} className="border-t border-white/10 p-3">
            <div className="flex items-end gap-2 rounded-xl border border-white/15 bg-black px-3 py-2 focus-within:border-[#D4AF37]">
              <textarea
                ref={messageInput}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                maxLength={2_000}
                rows={1}
                aria-label="Your message"
                placeholder="Ask us anything…"
                className="max-h-24 min-h-8 flex-1 resize-y bg-transparent py-1 text-sm text-white outline-none placeholder:text-gray-500"
              />
              <button
                type="submit"
                disabled={!draft.trim() || loading}
                aria-label="Send message"
                className="rounded-lg bg-[#D4AF37] p-2 text-black transition hover:bg-[#e4c65d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={17} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] leading-4 text-gray-500">
              Test assistant powered by Google Gemini. Free-tier chats may be used to improve Google products. Don&apos;t share personal, password, or payment details.
            </p>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close IRG assistant" : "Chat with IRG"}
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 font-semibold text-black shadow-lg shadow-black/40 transition hover:bg-[#e4c65d]"
      >
        {open ? <X size={19} aria-hidden="true" /> : <MessageCircle size={19} aria-hidden="true" />}
        <span>{open ? "Close" : "Ask IRG"}</span>
        {!open ? <Sparkles size={15} aria-hidden="true" /> : null}
      </button>
    </div>
  );
}
