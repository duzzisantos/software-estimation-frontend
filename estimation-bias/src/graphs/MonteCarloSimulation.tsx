import { AgCharts } from "ag-charts-react";

export interface Data {
  Simulation: number;
  Score: number;
}

interface Series {
  type: string;
  xKey: string;
  yKey: string;
}
export interface ChartOptions {
  data: Data[];
  title: { text: string };
  series: Series[];
}

const MonteCarloSimulation = ({ options }: { options: ChartOptions }) => {
  return <AgCharts options={options} style={{ height: "650px" }} />;
};

export default MonteCarloSimulation;
