import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Lock, ArrowRight, Shield, User, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";

export function LoginPage() {
  const { loginWithGitHub, loginWithKeys } = useAuth();
  const [mode, setMode] = useState<"github" | "keys">("github");
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [unlockKey, setUnlockKey] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !apiKey.trim() || !unlockKey.trim()) {
      toast.warning("Please fill in all fields");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    loginWithKeys(name.trim(), apiKey.trim(), unlockKey.trim());
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-blue-500/8 blur-[100px]" />
        <div className="absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full bg-violet-500/8 blur-[100px]" />
        <div className="absolute left-1/3 top-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div
        className={`relative w-full max-w-[380px] animate-fade-in-up ${shake ? "animate-shake" : ""}`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <Activity className="h-7 w-7 text-primary-foreground" strokeWidth={2} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Software Project Estimator
            </h1>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Sign in to access your workspace
            </p>
          </div>
        </div>

        <div className="mt-8 glass-strong rounded-2xl p-7">
          {mode === "github" ? (
            <>
              <Button
                onClick={loginWithGitHub}
                className="w-full h-11 gap-3 text-sm font-medium"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">or</span>
                </div>
              </div>

              <button
                onClick={() => setMode("keys")}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Use API key instead
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 pl-10"
                      autoFocus
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-xs font-medium">
                    API Key
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Enter your API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unlock-key" className="text-xs font-medium">
                    Unlock Key
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                    <Input
                      id="unlock-key"
                      type="password"
                      placeholder="Enter your unlock key"
                      value={unlockKey}
                      onChange={(e) => setUnlockKey(e.target.value)}
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="!mt-6 h-11 w-full text-[13px] font-semibold"
                >
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">or</span>
                </div>
              </div>

              <button
                onClick={() => setMode("github")}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Use GitHub instead
              </button>
            </>
          )}
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/50">
          <Shield className="h-3 w-3" />
          <span>Keys are verified by the backend on every request</span>
        </div>
      </div>
    </div>
  );
}
