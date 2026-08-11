"use client";

import { useState } from "react";
import { AdminPageHeader } from "../_components/AdminPageHeader";
import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  when: string;
  read: boolean;
};

const INITIAL: Message[] = [
  {
    id: "1",
    name: "Amara Obi",
    email: "amara.obi@example.com",
    subject: "SaaS dashboard — quote request",
    body: "Hi GLASSKID, loved Nexora on your portfolio. We need something similar for an internal ops tool. Do you have 20 minutes this week for a call?",
    when: "12 min ago",
    read: false,
  },
  {
    id: "2",
    name: "Tunde Bakare",
    email: "tunde.b@studioflow.io",
    subject: "Collab on a music player UI",
    body: "We're building a mobile-first music player and want your take on the visual direction. Portfolio looks great, especially the Echoes case study.",
    when: "3h ago",
    read: false,
  },
  {
    id: "3",
    name: "Chioma N.",
    email: "chioma.n@gmail.com",
    subject: "Freelance — landing page",
    body: "Simple one-pager for a small business, similar style to your homepage. What's your turnaround time and rate?",
    when: "yesterday",
    read: true,
  },
  {
    id: "4",
    name: "Femi Adeyemi",
    email: "femi@fintrackapp.com",
    subject: "Bug bounty / audit",
    body: "Would you be open to a short paid audit of our React Native app's performance? Saw your FinTrack project and it's the kind of work we need.",
    when: "2d ago",
    read: true,
  },
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [openId, setOpenId] = useState<string | null>(null);

  const unread = messages.filter((m) => !m.read).length;

  const open = (id: string) => {
    setOpenId((v) => (v === id ? null : id));
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const remove = (id: string) => setMessages((prev) => prev.filter((m) => m.id !== id));

  return (
    <>
      <AdminPageHeader eyebrow="Inbox" title="Messages" description={`${unread} unread of ${messages.length} inquiries from the contact form.`} />

      <div className="glass-card divide-y divide-white/5 overflow-hidden">
        {messages.map((m) => (
          <div key={m.id}>
            <button onClick={() => open(m.id)} className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-white/5">
              <span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ${m.read ? "bg-white/5 text-muted-foreground" : "bg-primary/15 text-primary"}`}>
                {m.read ? <MailOpen className="size-4" /> : <Mail className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`truncate text-sm ${m.read ? "font-medium text-foreground" : "font-semibold text-foreground"}`}>{m.name}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{m.when}</span>
                </div>
                <div className={`truncate text-sm ${m.read ? "text-muted-foreground" : "text-foreground/90"}`}>{m.subject}</div>
                {openId !== m.id && <div className="truncate text-xs text-muted-foreground">{m.body}</div>}
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
        {messages.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No messages.</div>}
      </div>
    </>
  );
}
