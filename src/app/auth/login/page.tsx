"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Submitting login for:", form.email);
    try {
      const res = await signIn("clinic", {
        ...form,
        redirect: false,
        callbackUrl: "/admin/clinic",
      });
      console.log("signIn response:", res);
      if (res?.error) {
        setError("Incorrect email or password");
        return;
      }
      if (res?.url) {
        console.log("Redirecting to:", res.url);
        router.replace(res.url);
      } else {
        console.log("Fallback redirect to /admin/clinic");
        router.replace("/admin/clinic");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Try again.");
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