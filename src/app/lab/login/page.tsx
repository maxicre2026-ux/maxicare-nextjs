"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function LabLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", { ...form, redirect: false });

    if (res?.error) {
      setError("Invalid credentials");
      return;
    }

    // بعد تسجيل الدخول بنجاح، نتحقق أن هذا الحساب خاص باللاب فقط
    try {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role as string | undefined;

      if (role !== "LAB_CLIENT") {
        // الحساب ليس حساب لاب -> نمنع الدخول للاب ونخرج المستخدم من السيشن
        setError("This account is not for the lab. Please use the clinic login page.");
        await signOut({ redirect: false });
        return;
      }

      // حساب لاب صحيح -> نوجهه للاب
      window.location.href = "/lab";
    } catch (err) {
      setError("Login error. Please try again.");
    }
  }

  return (
    <div className="max-w-sm mx-auto py-32 space-y-6">
      <h1 className="text-2xl font-bold text-accent">Lab Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { id: "email", label: "Email", type: "email" },
          { id: "password", label: "Password", type: "password" },
        ].map((f) => (
          <div key={f.id} className="flex flex-col gap-1">
            <label htmlFor={f.id} className="text-accent font-semibold">{f.label}</label>
            <input
              id={f.id}
              type={f.type}
              required
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
          Login
        </button>
      </form>
      <p>
        New user? <Link href="/lab/register" className="underline">Register</Link>
      </p>
    </div>
  );
}
