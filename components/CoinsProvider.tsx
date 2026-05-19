"use client";

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
  useState,
} from "react";

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
  const [balance, setBalanceState] = useState(DEFAULT_COIN_BALANCE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBalanceState(readStoredBalance());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeStoredBalance(balance);
  }, [balance, ready]);

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
