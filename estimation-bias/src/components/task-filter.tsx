import { useState, useRef, useEffect } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatTaskName } from "@/types";

interface TaskFilterProps {
  tasks: string[];
  visibleTasks: Set<string>;
  onToggle: (task: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

export function TaskFilter({
  tasks,
  visibleTasks,
  onToggle,
  onShowAll,
  onHideAll,
}: TaskFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
      >
        <Filter className="mr-1.5 h-3.5 w-3.5" />
        Filter
        <span className="ml-1.5 rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
          {visibleTasks.size}/{tasks.length}
        </span>
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-border/60 bg-popover p-4 shadow-lg animate-scale-in">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold">Visible Tasks</h4>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowAll}
                className="h-7 text-xs"
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onHideAll}
                className="h-7 text-xs"
              >
                None
              </Button>
            </div>
          </div>
          <Separator className="mb-3" />
          <div className="max-h-64 space-y-0.5 overflow-y-auto pr-1">
            {tasks.map((task) => (
              <div
                key={task}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors ${
                  visibleTasks.has(task) ? "bg-muted/60" : "hover:bg-muted/40"
                }`}
                onClick={() => onToggle(task)}
              >
                <Checkbox
                  id={`filter-${task}`}
                  checked={visibleTasks.has(task)}
                  onCheckedChange={() => onToggle(task)}
                />
                <Label
                  htmlFor={`filter-${task}`}
                  className="pointer-events-none cursor-pointer text-xs capitalize"
                >
                  {formatTaskName(task)}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
