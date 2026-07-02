import { useEffect, useState, useCallback, useMemo, Dispatch, SetStateAction } from "react";
import { Task } from "@/types";
import createWorkLogs from "./fetchTimeSeriesData";
import { fetchDataTraining, storeDataTraining } from "./fetchDataTraining";
import formatDate from "./formatDate";
import { getAuthHeaders } from "./authHeaders";

interface ResponseData {
  training_date: string;
  task_categories: string[];
  predicted_durations: number[];
}

export function useTimeSeriesData(
  selectedNewTasks: Task[],
  setSelectedNewTasks: Dispatch<SetStateAction<Task[]>>,
  userName: string,
) {
  const [responseData, setResponseData] = useState<ResponseData[]>([]);
  const url = import.meta.env.VITE_API_URL_TRAINING;

  useEffect(() => {
    async function fetchTrainedData() {
      try {
        const response = await fetch(`${url}/GetTrainedWorkLogs`, {
          method: "GET",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        });
        if (!response.ok) throw new Error(`${response.status}`);
        setResponseData(await response.json());
      } catch (error) {
        console.error(error);
      }
    }
    fetchTrainedData();
  }, [url]);

  const handleSelectedTasks = useCallback(
    (newTaskName: string) => {
      setSelectedNewTasks((prev) => {
        const exists = prev.find((t) => t.taskName === newTaskName);
        if (exists) return prev.filter((t) => t.taskName !== newTaskName);
        return [...prev, { taskName: newTaskName, timeEstimate: 0.0 }];
      });
    },
    [setSelectedNewTasks],
  );

  const updateTaskTime = useCallback(
    (taskName: string, newTimeEstimate: number) => {
      setSelectedNewTasks((prev) =>
        prev.map((t) =>
          t.taskName === taskName ? { ...t, timeEstimate: newTimeEstimate } : t,
        ),
      );
    },
    [setSelectedNewTasks],
  );

  const handleSubmitTasks = useCallback(async () => {
    const obj: Record<string, number | string> = {
      last_updated: formatDate(),
      submitted_by: userName,
    };
    selectedNewTasks.forEach((t) => {
      obj[t.taskName] = t.timeEstimate;
    });
    await createWorkLogs(obj);
  }, [selectedNewTasks]);

  const handleRetrainData = useCallback(async () => {
    await fetchDataTraining();
  }, []);

  const handleStoreData = useCallback(async () => {
    await storeDataTraining();
  }, []);

  const chartData = useMemo(() => {
    if (!responseData.length) return { data: [], dateKeys: [] };
    const recent = [...responseData].reverse().slice(0, 6);
    const categories = recent[0]?.task_categories ?? [];

    const data = categories.map((cat, i) => {
      const point: Record<string, string | number> = {
        task: cat.split("_").join(" "),
      };
      recent.forEach((entry) => {
        const label = new Date(entry.training_date).toLocaleDateString();
        point[label] = Math.round(entry.predicted_durations[i] ?? 0);
      });
      return point;
    });

    const dateKeys = recent.map((entry) =>
      new Date(entry.training_date).toLocaleDateString(),
    );

    return { data, dateKeys };
  }, [responseData]);

  return {
    responseData,
    chartData,
    handleSelectedTasks,
    updateTaskTime,
    handleSubmitTasks,
    handleRetrainData,
    handleStoreData,
  };
}
