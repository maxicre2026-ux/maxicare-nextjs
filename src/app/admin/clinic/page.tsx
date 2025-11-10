"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Filter, FileText, DollarSign } from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  approved: boolean;
  doctor?: string;
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

interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  category?: string;
  date: string;
}

export default function ClinicAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // States
  const [list, setList] = useState<Appointment[]>([]);
  const [filteredList, setFilteredList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [payInputs, setPayInputs] = useState<Record<string, string>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Filters
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterClient, setFilterClient] = useState("");
  
  // Expenses
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [addingExpense, setAddingExpense] = useState(false);
  
  // Report Modal
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);

  // redirect non-admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  // Load appointments
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/appointments", { credentials: "include" });
      const data = await res.json();
      setList(data.appointments ?? []);
      setFilteredList(data.appointments ?? []);
      setLoading(false);
    }
    if (status === "authenticated") load();
  }, [status]);

  // Load expenses
  useEffect(() => {
    async function loadExpenses() {
      const res = await fetch("/api/admin/expenses");
      const data = await res.json();
      setExpenses(data.expenses ?? []);
    }
    if (status === "authenticated") loadExpenses();
  }, [status]);

  // Apply filters
  useEffect(() => {
    let filtered = [...list];
    
    if (filterDoctor) {
      filtered = filtered.filter(a => 
        a.doctor?.toLowerCase().includes(filterDoctor.toLowerCase())
      );
    }
    
    if (filterClient) {
      filtered = filtered.filter(a => 
        a.user.name.toLowerCase().includes(filterClient.toLowerCase()) ||
        a.user.email.toLowerCase().includes(filterClient.toLowerCase())
      );
    }
    
    setFilteredList(filtered);
  }, [filterDoctor, filterClient, list]);

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

  async function addExpense() {
    if (!expenseDesc || !expenseAmount) {
      alert("Please enter description and amount");
      return;
    }
    
    setAddingExpense(true);
    
    try {
      const res = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: expenseDesc, 
          amount: parseFloat(expenseAmount),
          category: expenseCategory || null
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setExpenses([data.expense, ...expenses]);
        setExpenseDesc("");
        setExpenseAmount("");
        setExpenseCategory("");
        alert("✅ Expense added successfully!");
      } else {
        const error = await res.json();
        alert(`❌ Error: ${error.error || 'Failed to add expense'}`);
      }
    } catch (err) {
      alert("❌ Network error. Please try again.");
    } finally {
      setAddingExpense(false);
    }
  }

  async function loadReport() {
    setReportLoading(true);
    const params = new URLSearchParams();
    if (filterDoctor) params.set("doctor", filterDoctor);
    if (filterClient) params.set("clientEmail", filterClient);
    
    const res = await fetch(`/api/admin/reports?${params.toString()}`);
    const data = await res.json();
    setReportData(data);
    setReportLoading(false);
    setShowReport(true);
  }

  if (loading) return <p className="p-6">Loading…</p>;

  // Calculate totals
  const totalIncome = list.reduce((sum, a) => {
    const userTotal = a.user.payments.reduce((s, p) => s + p.amount, 0);
    return sum + userTotal;
  }, 0);
  
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-accent">Clinic Admin Dashboard</h1>
        
        {/* Balance Display */}
        <div className="bg-neutral-900/60 border-2 border-accent rounded-lg p-4 min-w-[250px]">
          <p className="text-sm text-accent/80 mb-1">Current Balance</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {balance.toFixed(2)} EGP
          </p>
          <div className="flex justify-between text-xs mt-2 pt-2 border-t border-accent/30">
            <span className="text-green-500">+{totalIncome.toFixed(2)}</span>
            <span className="text-red-500">-{totalExpenses.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-neutral-900/60 border border-accent/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={20} className="text-accent" />
          <h2 className="text-xl font-semibold text-accent">Filters</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-accent/80">Doctor</label>
            <input
              type="text"
              placeholder="Filter by doctor name..."
              className="w-full bg-background border border-accent/30 p-2 rounded text-sm mt-1"
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-accent/80">Client</label>
            <input
              type="text"
              placeholder="Filter by client name/email..."
              className="w-full bg-background border border-accent/30 p-2 rounded text-sm mt-1"
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setFilterDoctor(""); setFilterClient(""); }}
              className="border border-accent text-accent px-4 py-2 rounded hover:bg-accent/20 text-sm w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="bg-neutral-900/60 border border-accent/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={20} className="text-accent" />
          <h2 className="text-xl font-semibold text-accent">Clinic Expenses</h2>
        </div>
        
        {/* Add Expense Form */}
        <div className="grid md:grid-cols-4 gap-3 mb-4">
          <input
            type="text"
            placeholder="Description..."
            className="bg-background border border-accent/30 p-2 rounded text-sm"
            value={expenseDesc}
            onChange={(e) => setExpenseDesc(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount (EGP)..."
            className="bg-background border border-accent/30 p-2 rounded text-sm"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category (optional)..."
            className="bg-background border border-accent/30 p-2 rounded text-sm"
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
          />
          <button
            onClick={addExpense}
            disabled={addingExpense}
            className="border border-accent text-accent px-4 py-2 rounded hover:bg-accent/20 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingExpense ? "Adding..." : "Add Expense"}
          </button>
        </div>

        {/* Expenses List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {expenses.length === 0 ? (
            <p className="text-center text-accent/60 py-4">No expenses recorded yet</p>
          ) : (
            expenses.map((exp) => (
              <div key={exp.id} className="border border-red-500/30 bg-red-950/20 p-2 rounded text-sm flex justify-between items-center">
                <div>
                  <span className="font-semibold text-white">{exp.description}</span>
                  {exp.category && <span className="text-accent/60 ml-2">({exp.category})</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-accent/70">{new Date(exp.date).toLocaleDateString()}</span>
                  <span className="font-bold text-red-500">-{exp.amount} {exp.currency}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Button */}
      <div className="flex justify-end">
        <button
          onClick={loadReport}
          className="bg-accent text-black px-6 py-3 rounded font-bold hover:bg-accent/80 flex items-center gap-2"
        >
          <FileText size={20} />
          Generate Report
        </button>
      </div>

      {/* Appointments Table */}
      <div className="bg-neutral-900/60 border border-accent/30 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-accent mb-3">Appointments ({filteredList.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-accent/40">
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Doctor</th>
                <th className="py-2 text-left">Client</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Payments</th>
                <th className="py-2 text-left">Report</th>
                <th className="py-2 text-left">Prescription</th>
                <th className="py-2 text-left">Note</th>
                <th className="py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((a) => {
                const d = new Date(a.date);
                const dateStr = d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
                return (
                  <>
                  <tr key={a.id} className="border-b border-accent/10">
                    <td className="py-2">{dateStr}</td>
                    <td className="py-2">{a.doctor || "—"}</td>
                    <td className="py-2">
                      {a.user.name} <br />
                      <span className="text-xs text-accent/80">{a.user.email}</span>
                      {a.user.phone && (
                        <>
                          <br />
                          <span className="text-xs">📞 {a.user.phone}</span>
                        </>
                      )}
                    </td>
                    <td className="py-2">{a.approved ? "✅ Approved" : "⏳ Pending"}</td>
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
                        <a href={a.reportFiles[0].filename} target="_blank" className="underline text-accent">View</a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2">
                      {a.prescriptionFile ? (
                        <a href={a.prescriptionFile} target="_blank" className="underline text-accent">View</a>
                      ) : (
                        <input type="file" accept="application/pdf,image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPrescription(a.id, f); }} disabled={uploadingId === a.id} />
                      )}
                    </td>
                    <td className="py-2">
                      {a.note ? (
                        a.note
                      ) : (
                        <div className="flex gap-1 items-center">
                          <input type="text" placeholder="Report text..." className="bg-background border border-accent/30 p-1 rounded text-sm" value={notes[a.id] ?? ""} onChange={(e) => setNotes({ ...notes, [a.id]: e.target.value })} />
                          <button onClick={() => saveNote(a.id)} className="border border-accent text-accent px-2 py-1 rounded hover:bg-accent/20 text-xs">Save</button>
                        </div>
                      )}
                    </td>
                    <td className="py-2 space-x-2">
                      {!a.approved && (
                        <button onClick={() => approve(a.id)} className="border border-accent px-2 py-1 rounded hover:bg-accent/20 text-xs">Approve</button>
                      )}
                      <input type="file" accept="application/pdf,image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadReport(a.id, f); }} disabled={uploadingId === a.id} />
                    </td>
                  </tr>
                  {uploadStatus[a.id] && (
                    <tr>
                      <td colSpan={9} className="py-2 text-center text-sm font-semibold text-accent">
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
      </div>

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-accent rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-accent">Comprehensive Report</h2>
              <button onClick={() => setShowReport(false)} className="text-accent text-2xl">&times;</button>
            </div>
            
            {reportLoading ? (
              <p>Loading report...</p>
            ) : reportData ? (
              <div className="space-y-4">
                {/* Summary */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-neutral-900/60 p-4 rounded border border-accent/30">
                    <p className="text-sm text-accent/80">Total Appointments</p>
                    <p className="text-2xl font-bold text-accent">{reportData.summary.totalAppointments}</p>
                  </div>
                  <div className="bg-neutral-900/60 p-4 rounded border border-accent/30">
                    <p className="text-sm text-accent/80">Total Income</p>
                    <p className="text-2xl font-bold text-green-500">{reportData.summary.totalIncome} EGP</p>
                  </div>
                  <div className="bg-neutral-900/60 p-4 rounded border border-accent/30">
                    <p className="text-sm text-accent/80">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-500">{reportData.summary.totalExpenses} EGP</p>
                  </div>
                  <div className="bg-neutral-900/60 p-4 rounded border border-accent/30">
                    <p className="text-sm text-accent/80">Net Profit</p>
                    <p className={`text-2xl font-bold ${reportData.summary.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {reportData.summary.netProfit} EGP
                    </p>
                  </div>
                </div>

                {/* Detailed Tables */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-accent">Income Details</h3>
                  <table className="w-full text-sm border border-accent/30">
                    <thead>
                      <tr className="bg-neutral-900/60">
                        <th className="p-2 text-left">Client</th>
                        <th className="p-2 text-left">Amount</th>
                        <th className="p-2 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.payments.map((p: any) => (
                        <tr key={p.id} className="border-t border-accent/10">
                          <td className="p-2">{p.user.name}</td>
                          <td className="p-2 text-green-500">{p.amount} {p.currency}</td>
                          <td className="p-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-accent">Expenses Details</h3>
                  <table className="w-full text-sm border border-accent/30">
                    <thead>
                      <tr className="bg-neutral-900/60">
                        <th className="p-2 text-left">Description</th>
                        <th className="p-2 text-left">Category</th>
                        <th className="p-2 text-left">Amount</th>
                        <th className="p-2 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.expenses.map((e: any) => (
                        <tr key={e.id} className="border-t border-accent/10">
                          <td className="p-2">{e.description}</td>
                          <td className="p-2">{e.category || "—"}</td>
                          <td className="p-2 text-red-500">{e.amount} {e.currency}</td>
                          <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
