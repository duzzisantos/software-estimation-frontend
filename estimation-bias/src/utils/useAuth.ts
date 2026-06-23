import { useState, useCallback } from "react";

const API_KEY_HASH =
  "ae3ed1d24859737ae96d1bab375234925179b033986511da5b3116923bc812e2";
const UNLOCK_KEY_HASH =
  "5ba4024c3fb4c8b2be6a53722a61cff17f4de3ba35f909017d3d511c7a767291";

const SESSION_KEY = "spe-auth-session";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function isSessionValid(): boolean {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (!session) return false;
  try {
    const parsed = JSON.parse(session);
    return parsed.authenticated === true && typeof parsed.ts === "number";
  } catch {
    return false;
  }
}

function persistSession() {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ authenticated: true, ts: Date.now() })
  );
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(isSessionValid);
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (apiKey: string, unlockKey: string): Promise<boolean> => {
      setLoading(true);
      try {
        const [apiHash, unlockHash] = await Promise.all([
          sha256(apiKey),
          sha256(unlockKey),
        ]);

        if (apiHash === API_KEY_HASH && unlockHash === UNLOCK_KEY_HASH) {
          persistSession();
          setAuthenticated(true);
          return true;
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
    setAuthenticated(false);
  }, []);

  return { authenticated, loading, login, logout };
}
