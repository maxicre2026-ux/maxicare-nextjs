"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface TicketRow {
  id: string;
  subject: string;
  description?: string;
  attachment?: string;
  resultFile?: string;
  status: string;
  response?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    country?: string | null;
  };
}

function TicketRowItem({ t, onUpdate }: { t: TicketRow; onUpdate: (u: TicketRow) => void }) {
  const [resp, setResp] = useState(t.response || "");
  const [localStatus, setLocalStatus] = useState<string>(t.status);
  const [file, setFile] = useState<File | null>(null);

  async function sendUpdate() {
    const res = await fetch(`/api/admin/lab/tickets/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response: resp, status: localStatus }),
    });
    if (res.ok) onUpdate((await res.json()).ticket as TicketRow);
  }

  async function upload() {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/admin/lab/tickets/${t.id}/upload`, { method: "POST", body: fd });
    if (res.ok) {
      onUpdate((await res.json()).ticket as TicketRow);
      setFile(null);
    }
  }

  const d = new Date(t.createdAt).toLocaleString();
  return (
    <tr key={t.id} className="border-b border-accent/10 align-top hover:bg-accent/5">
      <td className="py-2 whitespace-nowrap">{d}</td>
      <td className="py-2">{t.subject}</td>
      <td className="py-2 text-xs whitespace-pre-wrap">
        {`${t.user?.name || ""}\n${t.user?.phone || "—"}\n${t.user?.address || ""} ${t.user?.country || ""}`}
      </td>
      <td className="py-2">
        <select
          value={localStatus}
          onChange={(e) => setLocalStatus(e.target.value)}
          className="bg-background border border-accent/30 p-1 text-xs"
        >
          {["PENDING", "IN_PROGRESS", "RESOLVED"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className="py-2">
        {t.attachment ? (
          <a href={`/tickets/${t.attachment}`} target="_blank" className="underline text-accent text-xs">View</a>
        ) : (
          "—"
        )}
      </td>
      <td className="py-2">
        {t.resultFile ? (
          <a href={`/tickets/results/${t.resultFile}`} target="_blank" className="underline text-accent text-xs">View</a>
        ) : (
          <>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-xs" />
            <button onClick={upload} className="border border-accent text-accent px-2 text-xs rounded mt-1">Upload</button>
          </>
        )}
      </td>
      <td className="py-2 text-xs">
        <textarea
          value={resp}
          onChange={(e) => setResp(e.target.value)}
          rows={3}
          className="w-40 bg-background border border-accent/30 p-1 text-xs"
        />
        <button onClick={sendUpdate} className="block border border-accent text-accent px-2 text-xs rounded mt-1">Send</button>
      </td>
    </tr>
  );
}

export default function LabAdminPage() {
  const { data: session, status } = useSession();
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) return;
    async function load() {
      const res = await fetch("/api/admin/lab/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets as TicketRow[]);
      }
      setLoading(false);
    }
    load();
  }, [isAdmin]);

  if (status === "loading") return <p className="p-6">Checking auth…</p>;
  if (!isAdmin) return <p className="p-6">Access denied</p>;

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-accent">Lab Admin - Tickets</h1>
      {loading ? (
        <p>Loading…</p>
      ) : tickets.length === 0 ? (
        <p>No tickets.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-accent/40">
              <th className="py-2 text-left">Date</th>
              <th className="py-2 text-left">Subject</th>
              <th className="py-2 text-left">Customer</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Attachment</th>
              <th className="py-2 text-left">Result</th>
              <th className="py-2 text-left">Response</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <TicketRowItem
                key={t.id}
                t={t}
                onUpdate={(u) => setTickets((prev) => prev.map((it) => (it.id === u.id ? u : it)))}
              />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
