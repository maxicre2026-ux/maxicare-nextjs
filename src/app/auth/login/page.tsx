"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    console.log("Submitting login for:", form.email);
    
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    
    console.log("signIn response:", res);
    
    if (res?.error) {
      setError("Incorrect email or password");
      return;
    }
    
    if (res?.ok) {
      // Fetch session to get user role
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;
      
      console.log("User role:", role);
      
      // Redirect based on role
      if (role === "ADMIN") {
        window.location.href = "/admin/clinic";
      } else if (role === "LAB_CLIENT") {
        window.location.href = "/admin/lab";
      } else {
        // Regular user -> clinic page
        window.location.href = "/clinic";
      }
    }
  }

  return (
    <div className="max-w-sm mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-accent">Login</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
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
        <button
          type="submit"
          style={{ backgroundColor: "#FFB12B", color: "#000" }}
          className="w-full py-2 font-semibold rounded hover:opacity-90"
        >
          Login
        </button>
      </form>
      <p>
        New user? <Link href="/auth/register" className="underline">Register</Link>
      </p>
    </div>
  );
}