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

function syncCoinsFromUser(user: PublicUser, setBalance: (n: number) => void) {
  setBalance(user.coins);
  writeStoredBalance(user.coins);
}

export function CoinsProvider({ children }: { children: React.ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const [balance, setBalanceState] = useState(DEFAULT_COIN_BALANCE);
  const [ready, setReady] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!authReady) return;

    if (user) {
      syncCoinsFromUser(user, setBalanceState);
      setReady(true);
      return;
    }

    setBalanceState(readStoredBalance());
    setReady(true);
  }, [authReady, user]);

  useEffect(() => {
    const onAuthChanged = (e: Event) => {
      const detail = (e as CustomEvent<PublicUser | null>).detail;
      if (detail) syncCoinsFromUser(detail, setBalanceState);
      else setBalanceState(readStoredBalance());
    };
    window.addEventListener("pdd-auth-changed", onAuthChanged);
    return () => window.removeEventListener("pdd-auth-changed", onAuthChanged);
  }, []);

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

  const setBalance = useCallback((next: number | ((prev: number) => number)) => {
    setBalanceState((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      return Math.max(0, value);
    });
  }, []);

  const applyEffect = useCallback((effect: CoinEffect) => {
    let result = 0;
    setBalanceState((prev) => {
      result = applyCoinEffect(prev, effect);
      return result;
    });
    return result;
  }, []);

  const trySpend = useCallback((amount: number) => {
    let ok = false;
    setBalanceState((prev) => {
      if (prev < amount) return prev;
      ok = true;
      return prev - amount;
    });
    return ok;
  }, []);

  const addCoins = useCallback((amount: number) => {
    if (amount <= 0) return;
    setBalanceState((prev) => prev + amount);
  }, []);

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
