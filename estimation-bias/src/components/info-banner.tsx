import { Info } from "lucide-react";

interface InfoBannerProps {
  children: React.ReactNode;
  variant?: "blue" | "cyan" | "amber";
}

const variantStyles = {
  blue: "bg-blue-500/5 border-blue-500/10 dark:bg-blue-400/5 dark:border-blue-400/10",
  cyan: "bg-cyan-500/5 border-cyan-500/10 dark:bg-cyan-400/5 dark:border-cyan-400/10",
  amber:
    "bg-amber-500/5 border-amber-500/10 dark:bg-amber-400/5 dark:border-amber-400/10",
};

const iconStyles = {
  blue: "text-blue-500/60 dark:text-blue-400/60",
  cyan: "text-cyan-500/60 dark:text-cyan-400/60",
  amber: "text-amber-500/60 dark:text-amber-400/60",
};

export function InfoBanner({ children, variant = "blue" }: InfoBannerProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-[13px] leading-relaxed text-muted-foreground ${variantStyles[variant]}`}
    >
      <Info className={`mt-0.5 h-4 w-4 shrink-0 ${iconStyles[variant]}`} />
      <div>{children}</div>
    </div>
  );
}
