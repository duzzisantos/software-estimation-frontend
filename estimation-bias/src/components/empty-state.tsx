import { type LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex h-52 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/50 bg-muted/10">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60">
        <Icon className="h-5 w-5 text-muted-foreground/60" strokeWidth={1.5} />
      </div>
      <div className="max-w-[240px] text-center">
        <p className="text-[13px] font-medium text-muted-foreground">{title}</p>
        {description && (
          <p className="mt-1.5 text-xs text-muted-foreground/60 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
