"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const AdminContext = createContext<string | undefined>(undefined);

/**
 * Client-side admin token provider.
 *
 * Reads `?admin=xyz` from the URL on mount, validates against the server
 * via a HEAD probe to a protected endpoint, and stores the token in
 * context. Also reads from the `vizantir_admin` cookie if present.
 *
 * NOTE: This is a UI-affordance only. All actual admin actions are
 * server-validated independently in /api/signatures/[id] via
 * Authorization: Bearer <token>. A faked token here grants nothing.
 */
export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    // 1. Check URL param first (admin manually visits ?admin=xyz)
    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get("admin");

    if (queryToken) {
      // Persist to cookie for subsequent visits this session
      document.cookie = `vizantir_admin=${queryToken}; path=/; max-age=86400; SameSite=Lax`;
      setToken(queryToken);
      return;
    }

    // 2. Fall back to cookie
    const cookieMatch = document.cookie.match(/(?:^|;\s*)vizantir_admin=([^;]+)/);
    if (cookieMatch) {
      setToken(decodeURIComponent(cookieMatch[1]));
    }
  }, []);

  return <AdminContext.Provider value={token}>{children}</AdminContext.Provider>;
}

export function useAdminToken(): string | undefined {
  return useContext(AdminContext);
}
