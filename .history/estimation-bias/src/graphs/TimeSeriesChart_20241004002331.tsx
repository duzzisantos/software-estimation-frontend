import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useChartOptions from "../utils/useChartOptions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface DataSets {
  label: string;
  data: number[];
  borderColor: string[];
  backgroundColor: string[];
}

const TimeSeriesChart = () => {
  const [period, selectedPeriod] = useState("");
  const [reponseData, setResponseData] = useState([]);
  const options = useChartOptions(period);

  useEffect(() => {
    async function storeDataTraining() {
      try {
        const response = await fetch(
          "http://localhost:8000/GetTrainedWorkLogs",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Allow: "GET",
            },
          }
        );

        if (!response.ok || response.status !== 200) {
          throw new Error(`${response.status}, Cause: ${response.type}`);
        } else {
          const data = await response.json();
          setResponseData(data);
        }
      } catch (error: unknown) {
        console.error(error);
      }
    }

    storeDataTraining();
  }, []);

  const generateData = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    const randomColor = `rgb(${r}, ${g}, ${b})`;
    const result: DataSets[] = [];

    reponseData.forEach(
      (element: { training_date: string; predicted_durations: number[] }) => {
        result.push({
          label: element.training_date,
          data: element.predicted_durations,
          backgroundColor: Array(15).fill(randomColor) as string[],
          borderColor: Array(15).fill(randomColor) as string[],
        });
      }
    );

    return result;
  };

  console.log(generateData());

  return <Line options={options} data={data} />;
};
