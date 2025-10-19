"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Role } from "@/configs";
import { defaultMenusFor } from "./useMenu/data";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  full_name?: string | null;
};

type Ctx = {
  user: AuthUser | null;
  loading: boolean;
  menus: Array<any>;
  setUser: (u: AuthUser | null) => void;
};

const Ctx = createContext<Ctx | null>(null);

export function AuthenticationProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/me", { credentials: "include" });
        if (!alive) return;
        if (r.ok) {
          const j = await r.json();
          setUser(j?.data?.user ?? null);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const menus = useMemo(
    () => defaultMenusFor(user?.role ?? "applicant"),
    [user?.role],
  );

  const value: Ctx = { user, loading, menus, setUser };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuthenticationProvider() {
  const v = useContext(Ctx);
  if (!v)
    throw new Error(
      "useAuthenticationProvider must be used within AuthenticationProvider",
    );
  return v;
}
