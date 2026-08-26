"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/api/auth";
import { useAuth } from "@/components/auth/auth-provider";
import type { RegisterPayload } from "@/types/auth";

export default function SignupPage() {
  const router = useRouter();
  const { login: handleLogin } = useAuth();

  const [form, setForm] = useState<RegisterPayload>({
    first_name: "",
    last_name: "",
    gender: "Male",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (field: keyof RegisterPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      try {
        await register(form);
        await handleLogin(form.email, form.password);
        router.replace("/");
      } catch (err: unknown) {
        const data =
          typeof err === "object" && err !== null && "response" in err
            ? (err as { response?: { data?: Record<string, unknown> } })
                .response?.data
            : undefined;
        if (data && typeof data === "object") {
          const messages = Object.values(data).flatMap((value) =>
            Array.isArray(value) ? value : [value],
          );
          setError(messages.join(" ") || "Could not create your account.");
        } else {
          setError("Could not create your account.");
        }
      }
    });
  };

  const inputClass =
    "border p-2.5 text-sm outline-none focus:border-primary w-full";

  return (
    <section className="w-screen flex-1 flex items-center justify-center py-16">
      <div className="w-full max-w-md mx-4 p-8 border bg-primary-foreground flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold">Create Account</h1>
          <p className="text-sm text-foreground/70">
            Join Digital Lair and start shopping.
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive border border-destructive/30 p-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">First Name</span>
              <input
                type="text"
                required
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                className={inputClass}
                placeholder="John"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Last Name</span>
              <input
                type="text"
                required
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                className={inputClass}
                placeholder="Doe"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Gender</span>
            <select
              value={form.gender}
              onChange={(e) =>
                handleChange("gender", e.target.value as RegisterPayload["gender"])
              }
              className={inputClass}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={inputClass}
              placeholder="At least 8 characters"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Confirm Password</span>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="Repeat your password"
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 bg-primary text-primary-foreground font-light px-4 py-2.5 rounded-sm disabled:opacity-60"
          >
            {isPending ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-foreground/70">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}