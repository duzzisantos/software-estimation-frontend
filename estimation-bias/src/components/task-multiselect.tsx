import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface TaskMultiSelectProps {
  allTasks: string[];
  selectedTasks: string[];
  onToggle: (task: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  accentColor?: "blue" | "cyan";
}

export function TaskMultiSelect({
  allTasks,
  selectedTasks,
  onToggle,
  onSelectAll,
  onClearAll,
  accentColor = "blue",
}: TaskMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const count = selectedTasks.length;

  const accentClasses =
    accentColor === "cyan"
      ? "bg-cyan-400/15 text-cyan-600 dark:text-cyan-400"
      : "bg-blue-400/15 text-blue-600 dark:text-blue-400";

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        className="w-full justify-between gap-2 sm:w-80"
      >
        <span className="truncate text-sm">
          {count === 0
            ? "Select tasks..."
            : `${count} task${count !== 1 ? "s" : ""} selected`}
        </span>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${accentClasses}`}
            >
              {count}
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl bg-popover p-4 shadow-lg ring-1 ring-border animate-fade-in sm:w-80">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold">Tasks</h4>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSelectAll}
                  className="h-7 text-xs"
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="h-7 text-xs"
                >
                  None
                </Button>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {allTasks.map((task) => {
                const isChecked = selectedTasks.includes(task);
                return (
                  <div
                    key={task}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors ${
                      isChecked ? "bg-muted/60" : "hover:bg-muted/40"
                    }`}
                    onClick={() => onToggle(task)}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onToggle(task)}
                    />
                    <Label className="pointer-events-none cursor-pointer text-xs capitalize">
                      {task.split("_").join(" ")}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
