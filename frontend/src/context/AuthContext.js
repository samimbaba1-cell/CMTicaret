"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (t) {
      setToken(t);
      apiFetch("/api/users/profile", { token: t })
        .then((res) => setUser(res.user))
        .catch(() => {
          setToken(null);
          if (typeof window !== "undefined") localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiFetch("/api/users/login", { method: "POST", body: { email, password } });
    setToken(res.token);
    setUser(res.user);
    if (typeof window !== "undefined") localStorage.setItem("token", res.token);
  };

  const register = async (payload) => {
    const res = await apiFetch("/api/users/register", { method: "POST", body: payload });
    setToken(res.token);
    setUser(res.user);
    if (typeof window !== "undefined") localStorage.setItem("token", res.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem("token");
  };

  const value = useMemo(() => ({ token, user, loading, login, register, logout }), [token, user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
