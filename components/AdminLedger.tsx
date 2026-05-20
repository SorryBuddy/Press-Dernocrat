"use client";

import { useAuth } from "@/components/AuthProvider";
import type { PublicUser } from "@/lib/auth/types";
import { useCallback, useEffect, useState } from "react";

export function AdminLedger() {
  const { user, refreshUser } = useAuth();
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [amount, setAmount] = useState("100");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    if (!res.ok) return;
    const data = (await res.json()) as { users: PublicUser[] };
    setUsers(data.users);
    if (!selectedId && data.users.length > 0) {
      setSelectedId(data.users[0].id);
    }
  }, [selectedId]);

  useEffect(() => {
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((d: { unlocked: boolean }) => {
        setUnlocked(d.unlocked);
        if (d.unlocked) void loadUsers();
      })
      .finally(() => setChecking(false));
  }, [loadUsers]);

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setCodeError(null);
    const code = digits.join("");
    if (code.length !== 6) {
      setCodeError("Enter all 6 digits.");
      return;
    }

    setBusy(true);
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    setBusy(false);

    if (!res.ok) {
      setCodeError("Invalid code.");
      setDigits(["", "", "", "", "", ""]);
      return;
    }

    setUnlocked(true);
    await loadUsers();
  }

  function handleDigit(index: number, value: string) {
    const d = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = d;
    setDigits(next);
    if (d && index < 5) {
      document.getElementById(`admin-digit-${index + 1}`)?.focus();
    }
  }

  async function grantCoins(target: "user" | "self") {
    setMessage(null);
    const n = parseInt(amount, 10);
    if (!Number.isFinite(n) || n <= 0) {
      setMessage("Enter a positive number of coins.");
      return;
    }

    setBusy(true);
    const res = await fetch("/api/admin/coins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        target === "self"
          ? { target: "self", amount: n }
          : { userId: selectedId, amount: n },
      ),
    });
    const data = (await res.json()) as { message?: string; error?: string; user?: PublicUser };
    setBusy(false);

    if (!res.ok) {
      setMessage(data.error ?? "Could not add coins.");
      return;
    }

    setMessage(data.message ?? "Coins added.");
    await loadUsers();
    if (target === "self" || selectedId === user?.id) {
      const fresh = await refreshUser();
      if (fresh) {
        window.dispatchEvent(new CustomEvent("pdd-auth-changed", { detail: fresh }));
      }
    }
  }

  if (checking) {
    return (
      <p className="font-sans text-sm text-neutral-600">Checking access…</p>
    );
  }

  if (!unlocked) {
    return (
      <form onSubmit={submitCode} className="mx-auto max-w-sm">
        <p className="font-sans text-sm text-neutral-600">
          Enter the 6-digit desk code to open the ledger.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              id={`admin-digit-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digits[i] && i > 0) {
                  document.getElementById(`admin-digit-${i - 1}`)?.focus();
                }
              }}
              className="h-12 w-10 rounded border border-neutral-300 text-center font-sans text-lg font-bold text-neutral-900 outline-none focus:border-[#c41230] focus:ring-1 focus:ring-[#c41230]"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>
        {codeError && (
          <p className="mt-3 text-center font-sans text-sm text-[#c41230]">{codeError}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full bg-[#c41230] px-4 py-3 font-sans text-sm font-bold uppercase tracking-wide text-white hover:bg-[#a30f28] disabled:opacity-60"
        >
          Unlock
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <p className="font-sans text-xs font-bold uppercase tracking-wide text-neutral-500">
          Signed in as
        </p>
        <p className="mt-1 font-serif text-lg font-bold text-neutral-900">
          {user?.name ?? "Unknown"}
        </p>
        <p className="font-sans text-sm text-neutral-600">{user?.email}</p>
        <p className="mt-1 font-sans text-sm font-semibold text-neutral-800">
          Balance: {user?.coins ?? 0} coins
        </p>
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-neutral-900">Add coins</h3>
        <label className="mt-4 block font-sans text-xs font-semibold uppercase tracking-wide text-neutral-600">
          Amount
        </label>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 font-sans text-sm text-neutral-900"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => grantCoins("self")}
            className="bg-[#c41230] px-4 py-2 font-sans text-sm font-bold uppercase tracking-wide text-white hover:bg-[#a30f28] disabled:opacity-60"
          >
            Add to me
          </button>
        </div>

        <label className="mt-6 block font-sans text-xs font-semibold uppercase tracking-wide text-neutral-600">
          User
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 font-sans text-sm text-neutral-900"
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email}) — {u.coins} coins
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={busy || !selectedId}
          onClick={() => grantCoins("user")}
          className="mt-4 w-full border border-neutral-900 bg-neutral-900 px-4 py-2 font-sans text-sm font-bold uppercase tracking-wide text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          Add to selected user
        </button>

        {message && (
          <p className="mt-4 font-sans text-sm font-semibold text-neutral-700">{message}</p>
        )}
      </section>

      <section>
        <h3 className="font-serif text-lg font-bold text-neutral-900">All users ({users.length})</h3>
        <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto font-sans text-sm text-neutral-700">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex justify-between gap-4 rounded border border-neutral-100 bg-white px-3 py-2"
            >
              <span>
                <strong>{u.name}</strong>
                <span className="block text-xs text-neutral-500">{u.email}</span>
              </span>
              <span className="shrink-0 font-bold tabular-nums">{u.coins}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
