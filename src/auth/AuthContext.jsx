import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "marketminds_auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());

  const value = useMemo(() => {
    const token = auth?.token || null;
    const user = auth?.user || null;

    return {
      token,
      user,
      isAuthed: Boolean(token && user?.id),
      setAuth: (nextAuth) => {
        setAuth(nextAuth);
        if (!nextAuth) localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
      },
      updateUser: (partialUser) => {
        setAuth((prev) => {
          if (!prev?.token || !prev?.user?.id) return prev;
          const next = { ...prev, user: { ...prev.user, ...partialUser } };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      },
      logout: () => {
        setAuth(null);
        localStorage.removeItem(STORAGE_KEY);
      },
    };
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

