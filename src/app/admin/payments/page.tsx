"use client";
import { useEffect, useState } from "react";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  notes?: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

export default function PaymentsPage() {
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ userId: string; from: string; to: string }>({ userId: "", from: "", to: "" });

  async function loadPayments() {
    setLoading(true);
    const q = new URLSearchParams();
    if (filter.userId) q.append('userId', filter.userId);
    if (filter.from) q.append('from', filter.from);
    if (filter.to) q.append('to', filter.to);
    const res = await fetch(`/api/admin/payments?${q.toString()}`, { credentials: 'include' });
    if (res.ok) { const data = await res.json(); setItems(data.payments ?? []); }
    setLoading(false);
  }

  useEffect(() => { loadPayments(); }, [filter]);

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-accent mb-4">Admin – Payments</h1>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end border border-accent/30 p-4 rounded">
        <div>
          <label className="block text-xs">Client</label>
          <select className="bg-background border p-1 rounded text-sm" value={filter.userId} onChange={e => setFilter({ ...filter, userId: e.target.value })}>
            <option value="">All</option>
            {Array.from(new Map(items.map(p => [p.user.id, p.user])).values()).map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs">From</label>
          <input type="date" className="bg-background border p-1 rounded text-sm" value={filter.from} onChange={e => setFilter({ ...filter, from: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs">To</label>
          <input type="date" className="bg-background border p-1 rounded text-sm" value={filter.to} onChange={e => setFilter({ ...filter, to: e.target.value })} />
        </div>
        <button onClick={loadPayments} className="border border-accent text-accent px-3 py-1 rounded text-sm">Apply</button>
      </div>
      {items.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-accent/40">
              <th className="py-2 text-left">Date</th>
              <th className="py-2 text-left">Client</th>
              <th className="py-2 text-left">Amount</th>
              <th className="py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b border-accent/10">
                <td className="py-2">{new Date(p.createdAt).toLocaleString()}</td>
                <td className="py-2">
                  {p.user.name}
                  <br />
                  <span className="text-xs text-accent/80">{p.user.email}</span>
                </td>
                <td className="py-2">
                  {p.amount} {p.currency}
                </td>
                <td className="py-2 text-xs whitespace-pre-wrap">{p.notes || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
