"use client";
import { useEffect, useState } from "react";

interface Booking {
  id: string;
  date: string; // ISO
  approved: boolean;
  reportFiles: { filename: string }[];
  prescriptionFile?: string;
  note?: string;
}

export default function BookingHistory() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch("/api/appointments/user");
      if (res.ok) {
        const data = await res.json();
        setItems(data.bookings);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (items.length === 0) return <p>No appointments yet.</p>;

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-accent/30">
          <th className="py-2 text-left">Date</th>
          <th className="py-2 text-left">Time</th>
          <th className="py-2 text-left">Status</th>
          <th className="py-2 text-left">Report</th>
          <th className="py-2 text-left">Prescription</th>
          <th className="py-2 text-left">Note</th>
        </tr>
      </thead>
      <tbody>
        {items.map((b) => {
          const d = new Date(b.date);
          const dateStr = d.toLocaleDateString();
          const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <tr key={b.id} className="border-b border-accent/10">
              <td className="py-2">{dateStr}</td>
              <td className="py-2">{timeStr}</td>
              <td className="py-2">{b.approved ? "Approved" : "Pending"}</td>
              <td className="py-2">
                {b.reportFiles?.length > 0 ? (
                  <a
                    href={`/reports/${b.reportFiles[0].filename}`}
                    target="_blank"
                    className="underline text-accent"
                  >
                    View
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="py-2 text-xs">{b.note ?? "—"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
