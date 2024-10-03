import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  results: number[];
}
const MonteCarloSimulation = ({ results }: Props) => {
  const options = {
    reponsive: true,
    plugins: {
      legend: {
        position: undefined,
      },
      title: {
        display: true,
        text: "Monte Carlo Simulation (10000 iterations)",
      },
    },
  };

  const labels = Array(10000).map((item: number) => item.toString());

  const data = {
    labels,
    datasets: [
      {
        label: "Total sales per category ($)",
        data: results,
        backgroundColor: ["#013f28"],
        borderColor: ["#013f28"],
      },
    ],
  };

  return (
    <>
      <Bar data={data} options={options} />
    </>
  );
};

export default React.memo(MonteCarloSimulation);
