"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Appointment {
  id: string;
  date: string;
  approved: boolean;
  note?: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    payments: { id: string; amount: number; currency: string }[];
  };
  reportFiles: { filename: string }[];
  prescriptionFile?: string;
}

export default function ClinicAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [list, setList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [payInputs, setPayInputs] = useState<Record<string, string>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // redirect non-admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/appointments", { credentials: "include" });
      const data = await res.json();
      setList(data.appointments ?? []);
      setLoading(false);
    }
    if (status === "authenticated") load();
  }, [status]);

  async function approve(id: string) {
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: true }),
    });
    if (res.ok) {
      setList((prev) => prev.map((a) => (a.id === id ? { ...a, approved: true } : a)));
    }
  }

  async function saveNote(id: string) {
    const text = notes[id];
    if (!text) return;
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportText: text }),
    });
    if (res.ok) {
      setList((prev) => prev.map((a) => (a.id === id ? { ...a, note: text } : a)));
      setNotes((n) => ({ ...n, [id]: "" }));
    }
  }

  async function uploadReport(id: string, file: File) {
    setUploadingId(id);
    setUploadStatus({ ...uploadStatus, [id]: "جاري الرفع..." });
    
    const form = new FormData();
    form.append("file", file);
    
    try {
      const res = await fetch(`/api/admin/appointments/${id}/report`, {
        method: "POST",
        body: form,
      });
      
      if (res.ok) {
        const data = await res.json();
        setList((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, reportFiles: [{ filename: data.filename }] } : a
          )
        );
        setUploadStatus({ ...uploadStatus, [id]: "✅ تم رفع التقرير بنجاح" });
        setTimeout(() => setUploadStatus({}), 3000);
      } else {
        setUploadStatus({ ...uploadStatus, [id]: "❌ فشل رفع التقرير" });
        setTimeout(() => setUploadStatus({}), 3000);
      }
    } catch (err) {
      setUploadStatus({ ...uploadStatus, [id]: "❌ خطأ في الرفع" });
      setTimeout(() => setUploadStatus({}), 3000);
    } finally {
      setUploadingId(null);
    }
  }

  async function addPayment(userId: string) {
    const val = parseFloat(payInputs[userId]);
    if (!val) return;
    const res = await fetch('/api/admin/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount: val }),
    });
    if (res.ok) {
      const data = await res.json();
      setList(prev => prev.map(a => a.user.email===data.payment.user.email ? { ...a, user: { ...a.user, payments: [...a.user.payments, data.payment] } } : a));
      setPayInputs(p=>({ ...p, [userId]: '' }));
    }
  }

  async function uploadPrescription(id: string, file: File) {
    setUploadingId(id);
    setUploadStatus({ ...uploadStatus, [id]: "جاري رفع الوصفة..." });
    
    const form = new FormData();
    form.append("file", file);
    
    try {
      const res = await fetch(`/api/admin/appointments/${id}/prescription`, {
        method: "POST",
        body: form,
      });
      
      if (res.ok) {
        const data = await res.json();
        setList((prev) => prev.map((a) => (a.id === id ? { ...a, prescriptionFile: data.prescriptionFile } : a)));
        setUploadStatus({ ...uploadStatus, [id]: "✅ تم رفع الوصفة بنجاح" });
        setTimeout(() => setUploadStatus({}), 3000);
      } else {
        setUploadStatus({ ...uploadStatus, [id]: "❌ فشل رفع الوصفة" });
        setTimeout(() => setUploadStatus({}), 3000);
      }
    } catch (err) {
      setUploadStatus({ ...uploadStatus, [id]: "❌ خطأ في الرفع" });
      setTimeout(() => setUploadStatus({}), 3000);
    } finally {
      setUploadingId(null);
    }
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-accent mb-4">Clinic Admin – Appointments</h1>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-accent/40">
            <th className="py-2 text-left">Date</th>
            <th className="py-2 text-left">Client</th>
            <th className="py-2 text-left">Status</th>
            <th className="py-2 text-left">Payments</th>
            <th className="py-2 text-left">Report File</th>
            <th className="py-2 text-left">Prescription</th>
            <th className="py-2 text-left">Note</th>
            <th className="py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((a) => {
            const d = new Date(a.date);
            const dateStr = d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
            return (
              <>
              <tr key={a.id} className="border-b border-accent/10">
                <td className="py-2">{dateStr}</td>
                <td className="py-2">
                  {a.user.name} <br />
                  <span className="text-xs text-accent/80">{a.user.email}</span>
                  {a.user.phone && (
                    <>
                      <br />
                      <span className="text-xs">📞 {a.user.phone}</span>
                    </>
                  )}
                  {a.user.address && (
                    <>
                      <br />
                      <span className="text-xs">🏠 {a.user.address}</span>
                    </>
                  )}
                </td>
                <td className="py-2">{a.approved ? "Approved" : "Pending"}</td>
                <td className="py-2 text-xs whitespace-pre-wrap">
                  {a.user.payments.length === 0
                    ? "—"
                    : a.user.payments.map(p => `${p.amount} ${p.currency}`).join(', ')}
                  <div className="flex gap-1 mt-1 items-center">
                    <input type="number" className="w-20 bg-background border border-accent/30 p-1 rounded text-xs" value={payInputs[a.user.id]||''} onChange={e=>setPayInputs({...payInputs,[a.user.id]:e.target.value})} placeholder="Amount" />
                    <button onClick={()=>addPayment(a.user.id)} className="border border-accent text-accent px-1 rounded text-xs">Add</button>
                  </div>
                </td>
                <td className="py-2">
                  {a.reportFiles.length > 0 ? (
                    <a
                      href={`/reports/${a.reportFiles[0].filename}`}
                      target="_blank"
                      className="underline text-accent"
                    >
                      View
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-2">
                  {a.prescriptionFile ? (
                    <a
                      href={`/prescriptions/${a.prescriptionFile}`}
                      target="_blank"
                      className="underline text-accent"
                    >
                      View
                    </a>
                  ) : (
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadPrescription(a.id, f);
                      }}
                    />
                  )}
                </td>
                <td className="py-2">
                  {a.note ? (
                    a.note
                  ) : (
                    <div className="flex gap-1 items-center">
                      <input
                        type="text"
                        placeholder="Report text..."
                        className="bg-background border border-accent/30 p-1 rounded text-sm"
                        value={notes[a.id] ?? ""}
                        onChange={(e) => setNotes({ ...notes, [a.id]: e.target.value })}
                      />
                      <button
                        onClick={() => saveNote(a.id)}
                        className="border border-accent text-accent px-2 py-1 rounded hover:bg-accent/20 text-xs"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </td>
                <td className="py-2 space-x-2">
                  {!a.approved && (
                    <button
                      onClick={() => approve(a.id)}
                      className="border border-accent px-2 py-1 rounded hover:bg-accent/20"
                    >
                      Approve
                    </button>
                  )}
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadReport(a.id, f);
                    }}
                    disabled={uploadingId === a.id}
                  />
                </td>
              </tr>
              {uploadStatus[a.id] && (
                <tr>
                  <td colSpan={8} className="py-2 text-center text-sm font-semibold text-accent">
                    {uploadStatus[a.id]}
                  </td>
                </tr>
              )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
