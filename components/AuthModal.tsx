"use client";

import { useAuth, type AuthMode } from "@/components/AuthProvider";
import { readStoredBalance } from "@/lib/coins";
import { useCallback, useEffect, useState } from "react";
import type { PublicUser } from "@/lib/auth/types";

export function AuthModal() {
  const { authOpen, authMode, closeAuth, setUser, openAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authOpen) return;
    setError(null);
    setLoading(false);
  }, [authOpen, authMode]);

  const switchMode = useCallback(
    (mode: AuthMode) => {
      setError(null);
      openAuth(mode);
    },
    [openAuth],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = authMode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const body =
        authMode === "signup"
          ? { email, password, name, coins: readStoredBalance() }
          : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as { user?: PublicUser; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      if (data.user) {
        setUser(data.user);
        closeAuth();
        window.dispatchEvent(new CustomEvent("pdd-auth-changed", { detail: data.user }));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!authOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={closeAuth}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
        className="relative w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={closeAuth}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded text-xl text-neutral-500 hover:bg-neutral-100"
          aria-label="Close dialog"
        >
          ×
        </button>

        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#c41230]">
          Press Dernocrat Daily
        </p>
        <h2 id="auth-dialog-title" className="mt-1 font-serif text-2xl font-bold text-neutral-900">
          {authMode === "signup" ? "Create your account" : "Welcome back"}
        </h2>
        <p className="mt-2 font-sans text-sm text-neutral-600">
          {authMode === "signup"
            ? "Sign up to save your coin balance across visits on this site."
            : "Log in to load your saved coins and profile."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {authMode === "signup" && (
            <label className="block">
              <span className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Name
              </span>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 font-sans text-sm text-neutral-900 outline-none focus:border-[#c41230] focus:ring-1 focus:ring-[#c41230]"
              />
            </label>
          )}

          <label className="block">
            <span className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 font-sans text-sm text-neutral-900 outline-none focus:border-[#c41230] focus:ring-1 focus:ring-[#c41230]"
            />
          </label>

          <label className="block">
            <span className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Password
            </span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={authMode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 font-sans text-sm text-neutral-900 outline-none focus:border-[#c41230] focus:ring-1 focus:ring-[#c41230]"
            />
            {authMode === "signup" && (
              <span className="mt-1 block font-sans text-xs text-neutral-500">
                At least 8 characters
              </span>
            )}
          </label>

          {error && (
            <p className="rounded bg-red-50 px-3 py-2 font-sans text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c41230] px-4 py-3 font-sans text-sm font-bold uppercase tracking-wide text-white hover:bg-[#a30f28] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Please wait…" : authMode === "signup" ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center font-sans text-sm text-neutral-600">
          {authMode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="font-semibold text-[#c41230] hover:underline"
                onClick={() => switchMode("login")}
              >
                Log in
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                type="button"
                className="font-semibold text-[#c41230] hover:underline"
                onClick={() => switchMode("signup")}
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
