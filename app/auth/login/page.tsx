"use client";

import { useState } from "react";
import { use, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { redirect } = use(searchParams);
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const returnTo =
    typeof redirect === "string" &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//")
      ? redirect
      : "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await login(email, password);
        router.replace(returnTo);
      } catch (err: unknown) {
        const detail =
          typeof err === "object" && err !== null && "response" in err
            ? (err as { response?: { data?: { detail?: string } } }).response
                ?.data?.detail
            : undefined;
        setError(
          detail ?? "Sign in failed. Please check your email and password.",
        );
      }
    });
  };

  return (
    <section className="w-screen flex-1 flex items-center justify-center py-16">
      <div className="w-full max-w-md mx-4 p-8 border bg-primary-foreground flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold">Sign In</h1>
          <p className="text-sm text-foreground/70">
            Welcome back to Digital Lair.
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive border border-destructive/30 p-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2.5 text-sm outline-none focus:border-primary"
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2.5 text-sm outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 bg-primary text-primary-foreground font-light px-4 py-2.5 rounded-sm disabled:opacity-60"
          >
            {isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-foreground/70">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary underline">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}