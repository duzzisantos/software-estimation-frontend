import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-2"
      >
        <Filter className="h-3.5 w-3.5" />
        Filter Tasks
        <span className="ml-1 rounded-full bg-blue-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
          {visibleTasks.size}/{tasks.length}
        </span>
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border bg-popover p-4 shadow-lg animate-fade-in">
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
            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div key={task} className="flex items-center gap-2">
                  <Checkbox
                    id={`filter-${task}`}
                    checked={visibleTasks.has(task)}
                    onCheckedChange={() => onToggle(task)}
                  />
                  <Label
                    htmlFor={`filter-${task}`}
                    className="cursor-pointer text-xs capitalize"
                  >
                    {task.split("_").join(" ")}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
