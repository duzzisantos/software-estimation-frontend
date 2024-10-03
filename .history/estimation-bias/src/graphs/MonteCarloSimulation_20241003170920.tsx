import { useState } from "react";
import { AgCharts } from "ag-charts-react";

interface Props {
  results: number[];
}
const MonteCarloSimulation = ({ results }: Props) => {
  const generateDataSet = () => {
    const output = [];
    for (let i = 0; i < results?.length; i++) {
      output.push({
        Simulation: i,
        Score: results[i],
      });
    }
    return output;
  };

  console.log(generateDataSet());

  const [options, setOptions] = useState({
    data: generateDataSet(),
    series: [{ type: "bar", xKey: "Simulation", yKey: "Score" }],
  });

  return <AgCharts options={options} />;
};

export default MonteCarloSimulation;
