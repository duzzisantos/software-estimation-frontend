import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PALETTE } from "../utils/generateRandomColors";
import { Alert } from "react-bootstrap";

interface ResponseData {
  training_date: string;
  task_categories: string[];
  predicted_durations: number[];
}

const TimeSeriesChart = () => {
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

  if (!responseData.length) {
    return (
      <Alert variant="info" className="border-0 mt-3 fw-normal">
        No training data available yet
      </Alert>
    );
  }

  const recent = [...responseData].reverse().slice(0, 6);
  const categories = recent[0]?.task_categories ?? [];

  const chartData = categories.map((cat, i) => {
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

  return (
    <div>
      <p className="text-muted mt-2 mb-3" style={{ fontSize: "0.85rem" }}>
        Predicted durations across {responseData.length} training periods — last
        6 shown
      </p>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, bottom: 80, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="task"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 9 }}
          />
          <YAxis
            label={{
              value: "Predicted Duration",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #ddd" }} />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          {dateKeys.map((key, idx) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={PALETTE[idx % PALETTE.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;
