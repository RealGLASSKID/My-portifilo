"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { markMessageRead, deleteMessage, type Message } from "./actions";

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(ts).toLocaleDateString();
}

export function MessagesClient({ initialMessages }: { initialMessages: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => setMessages(initialMessages), [initialMessages]);

  const unread = messages.filter((m) => !m.read).length;

  async function open(id: string) {
    setOpenId((v) => (v === id ? null : id));
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
      await markMessageRead(id);
      router.refresh();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await deleteMessage(id);
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Inbox"
        title="Messages"
        description={`${unread} unread of ${messages.length} from the contact form.`}
      />

      <div className="glass-card divide-y divide-white/5 overflow-hidden">
        {messages.map((m) => (
          <div key={m.id}>
            <button
              onClick={() => open(m.id)}
              className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-white/5"
            >
              <span
                className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ${
                  m.read ? "bg-white/5 text-muted-foreground" : "bg-primary/15 text-primary"
                }`}
              >
                {m.read ? <MailOpen className="size-4" /> : <Mail className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`truncate text-sm ${
                      m.read ? "font-medium text-foreground" : "font-semibold text-foreground"
                    }`}
                  >
                    {m.name}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {timeAgo(m.createdAt)}
                  </span>
                </div>
                <div
                  className={`truncate text-sm ${
                    m.read ? "text-muted-foreground" : "text-foreground/90"
                  }`}
                >
                  {m.subject}
                </div>
                {openId !== m.id && (
                  <div className="truncate text-xs text-muted-foreground">{m.body}</div>
                )}
              </div>
            </button>
            {openId === m.id && (
              <div className="animate-fade-up border-t border-white/5 bg-white/[0.02] p-4 pl-16">
                <p className="text-sm text-foreground/90">{m.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">{m.email}</p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`}
                    className="btn-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold"
                  >
                    <Reply className="size-3.5" /> Reply
                  </a>
                  <button
                    onClick={() => remove(m.id)}
                    className="btn-ghost-glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No messages yet. When someone uses the contact form, they will show up here.
          </div>
        )}
      </div>
    </>
  );
}