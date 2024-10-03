import { AgCharts } from "ag-charts-react";

interface Data {
  Simulation: number;
  Score: number;
}
interface ChartOptions {
  data: Data[];
  title: { text: string };
}
interface Props {
  options: ChartOptions;
}
const MonteCarloSimulation = ({ options }: Props) => {
  return <AgCharts options={options} style={{ height: "600px" }} />;
};

export default MonteCarloSimulation;
