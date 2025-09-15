// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // refreshSession logic (same idea as you had in App.jsx)
  const refreshSession = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      // your api wrapper might return the user directly or a { user } object.
      // support common shapes:
      const resolvedUser = res?.user ?? res?.data ?? res ?? null;
      setUser(resolvedUser || null);
      return resolvedUser || null;
    } catch (err) {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      setCheckingSession(true);
      await refreshSession();
      if (mounted) setCheckingSession(false);
    })();
    return () => {
      mounted = false;
    };
  }, [refreshSession]);

  // expose user and helpers
  const value = {
    user,
    setUser,
    checkingSession,
    refreshSession,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// hook to consume
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used inside a UserProvider");
  }
  return ctx;
}
