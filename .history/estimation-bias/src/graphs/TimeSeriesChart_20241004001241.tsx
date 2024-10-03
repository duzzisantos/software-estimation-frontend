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
    const result: {
      label: string;
      data: number[];
      borderColor: string[];
      backgroundColor: string[];
    }[] = [];
  };

  return <Line options={options} data={data} />;
};
