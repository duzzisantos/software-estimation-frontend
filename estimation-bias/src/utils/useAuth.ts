import { useState, useCallback } from "react";

const API_KEY_HASH = process.env.API_KEY_HASH as string;
const UNLOCK_KEY_HASH = process.env.UNLOCK_KEY_HASH as string;

const SESSION_KEY = process.env.SESSION_KEY as string;

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface SessionData {
  authenticated: boolean;
  ts: number;
  userName: string;
}

function getSession(): SessionData | null {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (!session) return null;
  try {
    const parsed = JSON.parse(session);
    if (parsed.authenticated === true && typeof parsed.ts === "number") {
      return parsed as SessionData;
    }
    return null;
  } catch {
    return null;
  }
}

function persistSession(userName: string) {
  const data: SessionData = { authenticated: true, ts: Date.now(), userName };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function useAuth() {
  const [session, setSession] = useState(getSession);
  const [loading, setLoading] = useState(false);

  const authenticated = session?.authenticated === true;
  const userName = session?.userName ?? "";

  const login = useCallback(
    async (
      name: string,
      apiKey: string,
      unlockKey: string,
    ): Promise<boolean> => {
      setLoading(true);
      try {
        const [apiHash, unlockHash] = await Promise.all([
          sha256(apiKey),
          sha256(unlockKey),
        ]);

        if (apiHash === API_KEY_HASH && unlockHash === UNLOCK_KEY_HASH) {
          persistSession(name);
          setSession(getSession());
          return true;
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  return { authenticated, loading, userName, login, logout };
}
