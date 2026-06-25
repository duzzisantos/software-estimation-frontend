import { useState, useCallback, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { Task, formatTaskName } from "@/types";
import { tasks as allTaskNames } from "@/utils/data";

interface UseTaskSelectionOptions {
  selectedTasks: Task[];
  setSelectedTasks: Dispatch<SetStateAction<Task[]>>;
}

export function useTaskSelection({
  selectedTasks,
  setSelectedTasks,
}: UseTaskSelectionOptions) {
  const [visibleTasks, setVisibleTasks] = useState<Set<string>>(
    () => new Set(allTaskNames),
  );

  const handleSelectedTasks = useCallback(
    (newTaskName: string) => {
      setSelectedTasks((prev) => {
        const exists = prev.find((t) => t.taskName === newTaskName);
        if (exists) return prev.filter((t) => t.taskName !== newTaskName);
        return [...prev, { taskName: newTaskName, timeEstimate: 0.0 }];
      });
    },
    [setSelectedTasks],
  );

  const updateTaskTime = useCallback(
    (taskName: string, newTimeEstimate: number) => {
      setSelectedTasks((prev) =>
        prev.map((t) =>
          t.taskName === taskName ? { ...t, timeEstimate: newTimeEstimate } : t,
        ),
      );
    },
    [setSelectedTasks],
  );

  const onTaskToggle = useCallback(
    (taskName: string) => {
      handleSelectedTasks(taskName);
      const isAdding = !selectedTasks.find((t) => t.taskName === taskName);
      toast(
        isAdding
          ? `Added ${formatTaskName(taskName)}`
          : `Removed ${formatTaskName(taskName)}`,
        { icon: isAdding ? "+" : "-" },
      );
    },
    [handleSelectedTasks, selectedTasks],
  );

  const onSelectAll = useCallback(() => {
    allTaskNames.forEach((t) => {
      if (!selectedTasks.find((s) => s.taskName === t)) {
        handleSelectedTasks(t);
      }
    });
    toast.success("All tasks selected");
  }, [handleSelectedTasks, selectedTasks]);

  const onClearAll = useCallback(() => {
    setSelectedTasks([]);
    toast("All tasks cleared");
  }, [setSelectedTasks]);

  const toggleVisibility = useCallback((t: string) => {
    setVisibleTasks((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }, []);

  const showAllVisible = useCallback(() => {
    setVisibleTasks(new Set(allTaskNames));
  }, []);

  const hideAllVisible = useCallback(() => {
    setVisibleTasks(new Set());
  }, []);

  return {
    visibleTasks,
    handleSelectedTasks,
    updateTaskTime,
    onTaskToggle,
    onSelectAll,
    onClearAll,
    toggleVisibility,
    showAllVisible,
    hideAllVisible,
  };
}
