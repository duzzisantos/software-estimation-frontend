import { useState } from "react";
import { toast } from "sonner";
import { Activity, KeyRound, Lock, ArrowRight, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginPageProps {
  loading: boolean;
  onLogin: (name: string, apiKey: string, unlockKey: string) => Promise<boolean>;
}

export function LoginPage({ loading, onLogin }: LoginPageProps) {
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [unlockKey, setUnlockKey] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !apiKey.trim() || !unlockKey.trim()) {
      toast.warning("Please fill in all fields");
      return;
    }

    const success = await onLogin(name.trim(), apiKey.trim(), unlockKey.trim());

    if (success) {
      toast.success(`Welcome, ${name.trim().split(" ")[0]}!`, {
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
              disabled={loading}
              className="!mt-6 h-11 w-full text-[13px] font-semibold"
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

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/50">
          <Shield className="h-3 w-3" />
          <span>Secured with SHA-256 credential hashing</span>
        </div>
      </div>
    </div>
  );
}
