"use client";

import { useAuth } from "@/components/AuthProvider";
import {
  DEFAULT_COIN_BALANCE,
  readStoredBalance,
  writeStoredBalance,
  type CoinEffect,
  applyCoinEffect,
} from "@/lib/coins";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PublicUser } from "@/lib/auth/types";

type CoinsContextValue = {
  balance: number;
  ready: boolean;
  setBalance: (next: number | ((prev: number) => number)) => void;
  applyEffect: (effect: CoinEffect) => number;
  trySpend: (amount: number) => boolean;
  addCoins: (amount: number) => void;
};

const CoinsContext = createContext<CoinsContextValue | null>(null);

export function CoinsProvider({ children }: { children: React.ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const [balance, setBalanceState] = useState(DEFAULT_COIN_BALANCE);
  const [ready, setReady] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Source-of-truth for the balance is kept on this ref so that mutators
   * (trySpend / applyEffect / addCoins) can read AND write the running
   * balance synchronously. Otherwise rapid calls in the same React tick
   * (e.g. spam-clicking the Plinko "Drop" button) all see the same stale
   * `balance` state and the second call falsely reports "not enough coins".
   *
   * React state stays in sync by setting both the ref and the state inside
   * every mutator. The ref is always considered authoritative.
   */
  const balanceRef = useRef(DEFAULT_COIN_BALANCE);

  const commit = useCallback((next: number) => {
    const clamped = Math.max(0, next);
    balanceRef.current = clamped;
    setBalanceState(clamped);
    return clamped;
  }, []);

  useEffect(() => {
    if (!authReady) return;

    if (user) {
      commit(user.coins);
      writeStoredBalance(user.coins);
      setReady(true);
      return;
    }

    commit(readStoredBalance());
    setReady(true);
  }, [authReady, user, commit]);

  useEffect(() => {
    const onAuthChanged = (e: Event) => {
      const detail = (e as CustomEvent<PublicUser | null>).detail;
      if (detail) {
        commit(detail.coins);
        writeStoredBalance(detail.coins);
      } else {
        commit(readStoredBalance());
      }
    };
    window.addEventListener("pdd-auth-changed", onAuthChanged);
    return () => window.removeEventListener("pdd-auth-changed", onAuthChanged);
  }, [commit]);

  useEffect(() => {
    if (!ready) return;
    writeStoredBalance(balance);

    if (!user) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/user/coins", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coins: balance }),
      }).catch(() => {});
    }, 400);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [balance, ready, user]);

  const setBalance = useCallback(
    (next: number | ((prev: number) => number)) => {
      const value = typeof next === "function" ? next(balanceRef.current) : next;
      commit(value);
    },
    [commit],
  );

  const applyEffect = useCallback(
    (effect: CoinEffect) => commit(applyCoinEffect(balanceRef.current, effect)),
    [commit],
  );

  const trySpend = useCallback(
    (amount: number) => {
      if (balanceRef.current < amount) return false;
      commit(balanceRef.current - amount);
      return true;
    },
    [commit],
  );

  const addCoins = useCallback(
    (amount: number) => {
      if (amount <= 0) return;
      commit(balanceRef.current + amount);
    },
    [commit],
  );

  const value = useMemo(
    () => ({ balance, ready, setBalance, applyEffect, trySpend, addCoins }),
    [balance, ready, setBalance, applyEffect, trySpend, addCoins],
  );

  return <CoinsContext.Provider value={value}>{children}</CoinsContext.Provider>;
}

export function useCoins() {
  const ctx = useContext(CoinsContext);
  if (!ctx) throw new Error("useCoins must be used within CoinsProvider");
  return ctx;
}
