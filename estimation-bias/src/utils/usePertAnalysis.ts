import { useState, useMemo, useCallback, Dispatch, SetStateAction } from "react";
import { Task } from "@/types";
import fetchPertData from "./fetchPertData";

export interface Results {
  simulated_operations: number[];
  predictions: {
    mean_duration: number;
    st_deviation: number;
    ninetieth_percentile: number;
  };
  pessimistic_estimation: number;
  most_likely_estimation: number;
  optimistic_estimation: number;
}

export function usePertAnalysis(
  selectedTasks: Task[],
  setSelectedTasks: Dispatch<SetStateAction<Task[]>>,
) {
  const [optimistic, setOptimistic] = useState(0.0);
  const [pessimistic, setPessimistic] = useState(0.0);
  const [results, setResults] = useState<Results>();

  const chartData = useMemo(() => {
    if (!results?.simulated_operations) return [];
    const binCount = 40;
    const ops = results.simulated_operations;
    const min = Math.min(...ops);
    const max = Math.max(...ops);
    const binWidth = (max - min) / binCount || 1;

    const bins = Array.from({ length: binCount }, (_, i) => ({
      range: `${(min + i * binWidth).toFixed(0)}-${(min + (i + 1) * binWidth).toFixed(0)}`,
      count: 0,
    }));

    ops.forEach((val) => {
      const idx = Math.min(Math.floor((val - min) / binWidth), binCount - 1);
      bins[idx].count++;
    });

    return bins;
  }, [results]);

  const totalMostLikelyTime = useMemo(
    () => selectedTasks.reduce((acc, t) => acc + t.timeEstimate, 0),
    [selectedTasks],
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

  const handleSubmit = useCallback(async () => {
    const res = await fetchPertData({
      optimistic,
      most_likely: totalMostLikelyTime,
      pessimistic,
    });
    setResults(res);
  }, [optimistic, pessimistic, totalMostLikelyTime]);

  return {
    optimistic,
    setOptimistic,
    pessimistic,
    setPessimistic,
    results,
    chartData,
    totalMostLikelyTime,
    handleSelectedTasks,
    updateTaskTime,
    handleSubmit,
  };
}
