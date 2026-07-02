import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  email: string | null;
}

interface AuthState {
  user: GitHubUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userName: string;
  loginWithGitHub: () => void;
  loginWithKeys: (name: string, apiKey: string, unlockKey: string) => void;
  logout: () => void;
  apiKey: string;
  unlockKey: string;
}

const AuthContext = createContext<AuthState | null>(null);

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID ?? "";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState(
    () => localStorage.getItem("user_name") ?? "",
  );
  const [apiKey, setApiKeyState] = useState(
    () => localStorage.getItem("api_key") ?? "",
  );
  const [unlockKey, setUnlockKeyState] = useState(
    () => localStorage.getItem("unlock_key") ?? "",
  );

  useEffect(() => {
    const stored = localStorage.getItem("gh_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("gh_user");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return;

    window.history.replaceState({}, "", window.location.pathname);

    const exchangeCode = async () => {
      try {
        const base = import.meta.env.VITE_API_URL_CRUD;
        const res = await fetch(`${base}/auth/github/callback?code=${code}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem("gh_user", JSON.stringify(data.user));
          setUserName(data.user?.name ?? data.user?.login ?? "");
          localStorage.setItem("user_name", data.user?.name ?? data.user?.login ?? "");
          if (data.api_key) {
            setApiKeyState(data.api_key);
            localStorage.setItem("api_key", data.api_key);
          }
          if (data.unlock_key) {
            setUnlockKeyState(data.unlock_key);
            localStorage.setItem("unlock_key", data.unlock_key);
          }
        }
      } catch {
        // backend unreachable — user stays logged out
      }
      setIsLoading(false);
    };
    exchangeCode();
  }, []);

  const loginWithGitHub = useCallback(() => {
    const scope = "read:user user:email";
    const redirectUri = window.location.origin;
    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = url;
  }, []);

  const loginWithKeys = useCallback(
    (name: string, key: string, unlock: string) => {
      setUserName(name);
      localStorage.setItem("user_name", name);
      setApiKeyState(key);
      localStorage.setItem("api_key", key);
      setUnlockKeyState(unlock);
      localStorage.setItem("unlock_key", unlock);
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    setUserName("");
    setApiKeyState("");
    setUnlockKeyState("");
    localStorage.removeItem("gh_user");
    localStorage.removeItem("user_name");
    localStorage.removeItem("api_key");
    localStorage.removeItem("unlock_key");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(apiKey),
        isLoading,
        userName,
        loginWithGitHub,
        loginWithKeys,
        logout,
        apiKey,
        unlockKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
