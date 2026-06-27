import { type LucideIcon } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";

interface StatCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  label: string;
  value: string | number;
  badge?: {
    text: string;
    variant: BadgeProps["variant"];
  };
}

export function StatCard({
  icon: Icon,
  iconClassName = "text-primary",
  label,
  value,
  badge,
}: StatCardProps) {
  return (
    <div className="glass rounded-2xl p-5 hover-lift">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/50">
          <Icon className={`h-[18px] w-[18px] ${iconClassName}`} strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 truncate text-2xl font-bold tracking-tight tabular-nums">
            {value}
          </p>
          {badge && (
            <Badge variant={badge.variant} className="mt-2.5">
              {badge.text}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
