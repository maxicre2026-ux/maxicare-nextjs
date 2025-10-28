"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MediaSlider, { MediaItem } from "@/components/MediaSlider";
import { signOut } from "next-auth/react";

interface Ticket {
  id: string;
  subject: string;
  description?: string;
  attachment?: string;
  files?: { id: string; filename: string }[];
  resultFile?: string;
  response?: string;
  status?: string;
  messages?: { id: string; text: string; author: string; createdAt: string }[];
  createdAt: string;
}

export default function LabPage() {
  const { data: session, status } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const slides: MediaItem[] = [
    { src: "/assets/Lab/lab-slide1.jpg" },
    { src: "/assets/Lab/lab-slide2.jpg" },
    { src: "/assets/Lab/lab-video.mp4", type: "video" },
  ];

  // load tickets when authenticated and role permitted
  const loadTickets = async () => {
    const res = await fetch("/api/lab/tickets", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setTickets(data.tickets);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    const role = (session?.user as any).role;
    if (role !== "LAB_CLIENT" && role !== "ADMIN") return;
    loadTickets();
  }, [status, session?.user]);

  async function createTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!subject) return;
    setSubmitting(true);
    setError("");
    const form = new FormData();
    form.append("subject", subject);
    if (description) form.append("description", description);
    if (file) form.append("file", file);

    const res = await fetch("/api/lab/tickets", {
      method: "POST",
      body: form,
    });
    if (res.ok) {
      const data = await res.json();
      setTickets((prev) => [data.ticket, ...prev]);
      setSubject("");
      setDescription("");
      setFile(null);
    } else {
      let errMsg = "Failed";
      try {
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) {
          const data = await res.json();
          errMsg = data.error || errMsg;
        } else {
          errMsg = await res.text();
        }
      } catch {}
      setError(errMsg);
    }
    setSubmitting(false);
  }

  // access guard
  if (status === "authenticated" && (session?.user as any).role !== "LAB_CLIENT" && (session?.user as any).role !== "ADMIN") {
    return <p className="p-6">Access denied.</p>;
  }

  return (
    <section className="space-y-10 py-8">
      {/* Hero + Slider */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Text */}
        <div className="space-y-6 order-2 md:order-1">
          <h2 className="text-3xl font-bold text-accent">Welcome to Our Lab</h2>
          <p className="text-lg max-w-prose">Book lab tests, upload samples and download your results online.</p>
        </div>
        {/* Slider */}
        <div className="order-1 md:order-2">
          <MediaSlider items={slides} heightClass="h-[300px]" />
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-accent mb-4">Lab Tickets</h1>

      {/* Auth states */}
      {status === "loading" && <p>Loading…</p>}
      {status === "unauthenticated" && (
        <p>
          Please <a href="/lab/login" className="underline text-accent">Login</a> or {" "}
          <a href="/lab/register" className="underline text-accent">Register</a> to create tickets.
        </p>
      )}

      {status === "authenticated" && (
        <>
          {/* Logout */}
          <button onClick={() => signOut({ callbackUrl: "/lab/login" })} className="border border-accent text-accent px-4 py-1 rounded mb-4 hover:bg-accent/20">Logout</button>
          {/* Create ticket form */}
          <div className="border border-accent/40 p-6 rounded space-y-4 max-w-xl">
            <h2 className="text-xl font-semibold text-accent">Create New Ticket</h2>
            <form onSubmit={createTicket} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="subject">Subject *</label>
                <input
                  id="subject"
                  type="text"
                  required
                  className="bg-background border border-accent/30 p-2 rounded"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="desc">Description</label>
                <textarea
                  id="desc"
                  rows={3}
                  className="bg-background border border-accent/30 p-2 rounded"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Attachment (optional)</label>
                <input name="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {file && <span className="text-xs">{file.name}</span>}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: "#FFB12B", color: "#000" }}
                className="w-full py-2 font-semibold rounded hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Create Ticket"}
              </button>
            </form>
          </div>

          {/* Ticket list */}
          <div className="space-y-4">
            <div className="flex items-center gap-2"><h2 className="text-2xl font-semibold text-accent">My Tickets</h2><button onClick={loadTickets} className="border border-accent text-accent px-2 py-1 text-xs rounded">Refresh</button></div>
            {loading ? (
              <p>Loading…</p>
            ) : tickets.length === 0 ? (
              <p>No tickets yet.</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-accent/40">
                    <th className="py-2 text-left">Date</th>
                    <th className="py-2 text-left">Subject</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-left">Attachment</th>
                    <th className="py-2 text-left">Result</th>
                    <th className="py-2 text-left">Response</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => {
                    const d = new Date(t.createdAt);
                    const dateStr = d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
                    return (
                      <tr key={t.id} className="border-b border-accent/10">
                        <td className="py-2">{dateStr}</td>
                        <td className="py-2">{t.subject}</td>
                        <td className="py-2 text-xs">{t.status ?? '—'}</td>
                        <td className="py-2">
                          {t.attachment ? (
                            <a href={`/tickets/${t.attachment}`} target="_blank" className="underline text-accent">View</a>
                          ) : "—"}
                        </td>
                        <td className="py-2">
                          {t.files && t.files.length > 0 ? t.files.map(f => (
                            <a key={f.id} href={`/tickets/results/${f.filename}`} target="_blank" className="underline text-accent text-xs mr-1">View</a>
                          )) : t.resultFile ? (
                            <a href={`/tickets/results/${t.resultFile}`} target="_blank" className="underline text-accent text-xs">View</a>
                          ) : "—"}
                        </td>
                        <td className="py-2 text-xs whitespace-pre-wrap">
                          {(t.messages && t.messages.length > 0
                            ? t.messages.filter(m => m.author === 'ADMIN').map(m => m.text).join('\n')
                            : t.response || '—') }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </section>
  );
}
