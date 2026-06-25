import { Info } from "lucide-react";

interface InfoBannerProps {
  children: React.ReactNode;
  variant?: "blue" | "cyan" | "amber";
}

const variantStyles = {
  blue: "border-blue-200 bg-blue-50/50 dark:border-blue-500/20 dark:bg-blue-500/5",
  cyan: "border-cyan-200 bg-cyan-50/50 dark:border-cyan-500/20 dark:bg-cyan-500/5",
  amber:
    "border-amber-200 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-500/5",
};

export function InfoBanner({ children, variant = "blue" }: InfoBannerProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm text-muted-foreground ${variantStyles[variant]}`}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/70" />
      <div>{children}</div>
    </div>
  );
}
