"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

interface Slot {
  iso: string;
  label: string;
}

export default function BookingCalendar() {
  const today = new Date().toISOString().split("T")[0];
  // generate next 14 days for dropdown
  const dates = useMemo(() => {
    const arr: string[] = [];
    const start = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      arr.push(d.toISOString().split("T")[0]);
    }
    return arr;
  }, []);
  const [date, setDate] = useState<string>(today);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [doctor, setDoctor] = useState("Mohamed Gamal");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);
      const res = await fetch(`/api/appointments?date=${date}&doctor=${doctor}`);
      const data = await res.json();
      const list: Slot[] = data.available.map((iso: string) => {
        const d = new Date(iso);
        const label = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return { iso, label };
      });
      setSlots(list);
      setLoading(false);
    }
    fetchSlots();
  }, [date, doctor]);

  async function book(slot: Slot) {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateTime: slot.iso, doctor }),
    });
    if (res.status === 401) {
      router.push("/auth/login");
      return;
    }
    if (res.ok) {
      alert("Appointment booked!");
      setSlots((prev) => prev.filter((s) => s.iso !== slot.iso));
    } else {
      const data = await res.json();
      alert(data.error || "Failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label htmlFor="doctor">Doctor:</label>
        <select id="doctor" value={doctor} onChange={(e) => setDoctor(e.target.value)} className="bg-background border border-accent/40 p-1 rounded">
          <option>Mohamed Gamal</option>
          <option>Ahmed Rady</option>
        </select>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <label htmlFor="date">Select Date:</label>
        <select
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-background border border-accent/40 p-1 rounded"
        >
          {dates.map((d) => {
            const dObj = new Date(d);
            const label = dObj.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
            return (
              <option key={d} value={d}>
                {label}
              </option>
            );
          })}
        </select>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {slots.length === 0 && <p>No slots available</p>}
          {slots.map((slot) => (
            <button
              key={slot.iso}
              onClick={() => book(slot)}
              className="border border-accent px-3 py-2 rounded hover:bg-accent/20"
            >
              {slot.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
