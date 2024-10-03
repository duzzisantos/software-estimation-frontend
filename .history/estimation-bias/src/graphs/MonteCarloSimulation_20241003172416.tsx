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
  // const generateDataSet = () => {
  //   const output = [];
  //   for (let i = 0; i < results?.length; i++) {
  //     output.push({
  //       Simulation: i + 1,
  //       Score: results[i],
  //     });
  //   }
  //   return output;
  // };

  // console.log(generateDataSet());

  // const [options, setOptions] = useState({
  //   data: generateDataSet(),
  //   title: { text: "PERT Analysis using Monte Carlo Simulations" },
  //   // series: [{ type: 'bar', xKey: 'Simulation', yKey: 'Score' }],
  // });

  return <AgCharts options={options} />;
};

export default MonteCarloSimulation;
