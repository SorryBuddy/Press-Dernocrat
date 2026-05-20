"use client";

import { AuthModal } from "@/components/AuthModal";
import type { PublicUser } from "@/lib/auth/types";
import { getOrCreateDeviceId } from "@/lib/device-id";
import { readStoredBalance } from "@/lib/coins";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AuthMode = "signup" | "login";

type AuthContextValue = {
  user: PublicUser | null;
  ready: boolean;
  authOpen: boolean;
  authMode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setUser: (user: PublicUser | null) => void;
  refreshUser: () => Promise<PublicUser | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = (await res.json()) as { user: PublicUser | null };
      if (data.user) {
        setUser(data.user);
        return data.user;
      }

      const deviceId = getOrCreateDeviceId();
      const guestRes = await fetch("/api/auth/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          coins: readStoredBalance(),
        }),
      });
      if (guestRes.ok) {
        const guestData = (await guestRes.json()) as { user: PublicUser };
        setUser(guestData.user);
        window.dispatchEvent(
          new CustomEvent("pdd-auth-changed", { detail: guestData.user }),
        );
        return guestData.user;
      }

      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setReady(true));
  }, [refreshUser]);

  const openAuth = useCallback((mode: AuthMode = "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.dispatchEvent(new CustomEvent("pdd-auth-changed", { detail: null }));
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      authOpen,
      authMode,
      openAuth,
      closeAuth,
      setUser,
      refreshUser,
      logout,
    }),
    [user, ready, authOpen, authMode, openAuth, closeAuth, refreshUser, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
