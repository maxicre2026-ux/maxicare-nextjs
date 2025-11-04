"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    address: "",
  });
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      window.location.href = "/clinic";
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  }

  return (
    <div className="max-w-sm mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-accent">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { id: "name", label: "Name", type: "text" },
          { id: "email", label: "Email", type: "email" },
          { id: "password", label: "Password", type: "password" },
          { id: "phone", label: "Phone", type: "text" },
          { id: "age", label: "Age", type: "number" },
          { id: "address", label: "Address", type: "text" },
        ].map((f) => (
          <div key={f.id} className="flex flex-col gap-1">
            <label htmlFor={f.id}>{f.label}</label>
            <input
              id={f.id}
              type={f.type}
              required
              className="p-2 rounded bg-background border border-accent/30"
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
        Already have an account? <Link href="/auth/login" className="underline">Login</Link>
      </p>
    </div>
  );
}
