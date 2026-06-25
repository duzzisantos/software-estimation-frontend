import { useState } from "react";
import { toast } from "sonner";
import { Activity, KeyRound, Lock, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginPageProps {
  loading: boolean;
  onLogin: (apiKey: string, unlockKey: string) => Promise<boolean>;
}

export function LoginPage({ loading, onLogin }: LoginPageProps) {
  const [apiKey, setApiKey] = useState("");
  const [unlockKey, setUnlockKey] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim() || !unlockKey.trim()) {
      toast.warning("Please fill in both fields");
      return;
    }

    const success = await onLogin(apiKey.trim(), unlockKey.trim());

    if (success) {
      toast.success("Welcome back!", {
        description: "Authentication successful",
      });
    } else {
      toast.error("Invalid credentials", {
        description: "Please check your API key and unlock key",
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/3 blur-3xl" />
      </div>

      <div
        className={`relative w-full max-w-sm animate-fade-in-up ${shake ? "animate-shake" : ""}`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <Activity className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Software Project Estimator
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access your workspace
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-xs font-medium">
                API Key
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-10 pl-10"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unlock-key" className="text-xs font-medium">
                Unlock Key
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  id="unlock-key"
                  type="password"
                  placeholder="Enter your unlock key"
                  value={unlockKey}
                  onChange={(e) => setUnlockKey(e.target.value)}
                  className="h-10 pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-10 w-full"
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/60">
          <Shield className="h-3 w-3" />
          <span>Secured with SHA-256 credential hashing</span>
        </div>
      </div>
    </div>
  );
}
