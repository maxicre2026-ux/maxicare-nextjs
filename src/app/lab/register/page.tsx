"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LabRegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    address: "",
  });
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/register-lab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      window.location.href = "/lab";
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  }

  const fields = [
    { id: "name", label: "Name", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "password", label: "Password", type: "password" },
    { id: "phone", label: "Phone", type: "text" },
    { id: "country", label: "Country", type: "text" },
    { id: "address", label: "Address", type: "text" },
  ];

  return (
    <div className="max-w-sm mx-auto py-32 space-y-6">
      <h1 className="text-2xl font-bold text-accent">Lab Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((f) => (
          <div key={f.id} className="flex flex-col gap-1">
            <label htmlFor={f.id} className="text-accent font-semibold">{f.label}</label>
            <input
              id={f.id}
              type={f.type}
              required={f.id !== "phone" && f.id !== "address" && f.id !== "country" ? true : false}
              className="p-3 rounded bg-neutral-800 border-2 border-accent text-white placeholder:text-gray-400 focus:outline-none focus:border-accent/80"
              value={(form as any)[f.id]}
              onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
            />
          </div>
        ))}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          style={{ backgroundColor: "#FFB12B", color: "#000" }}
          className="w-full py-2 font-semibold rounded hover:opacity-90"
        >
          Register
        </button>
      </form>
      <p>
        Already have an account? <Link href="/lab/login" className="underline">Login</Link>
      </p>
    </div>
  );
}
