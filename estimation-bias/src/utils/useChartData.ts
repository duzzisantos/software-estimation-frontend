import { useEffect, useState, useMemo } from "react";

interface ResponseData {
  training_date: string;
  task_categories: string[];
  predicted_durations: number[];
}

export function useChartData() {
  const [responseData, setResponseData] = useState<ResponseData[]>([]);
  const url = import.meta.env.VITE_API_URL_TRAINING;

  useEffect(() => {
    async function fetchTrainedData() {
      try {
        const response = await fetch(`${url}/GetTrainedWorkLogs`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`${response.status}, Cause: ${response.type}`);
        }
        const data = await response.json();
        setResponseData(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTrainedData();
  }, [url]);

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
      new Date(entry.training_date).toLocaleDateString()
    );

    return { data, dateKeys };
  }, [responseData]);

  return {
    responseData,
    chartData,
  };
}
