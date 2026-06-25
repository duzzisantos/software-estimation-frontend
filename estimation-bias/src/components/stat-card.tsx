import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="hover-lift">
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/80">
          <Icon className={`h-5 w-5 ${iconClassName}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 truncate text-xl font-bold tracking-tight">
            {value}
          </p>
          {badge && (
            <Badge variant={badge.variant} className="mt-2">
              {badge.text}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
