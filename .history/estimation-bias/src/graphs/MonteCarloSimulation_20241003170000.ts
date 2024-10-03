import React, { useState } from "react";
import { ReactDOM } from "react-dom/client";

import { AgCharts } from "ag-charts-react";

interface Props {
  results: number[];
}
const MonteCarloSimulation = ({ results }: Props) => {
  const generateDataSet = () => {
    const output = [];
    for (let i = 0; i < results?.length + 1 + 1; i++) {
      output.push({
        Simulation: i,
        Score: results[i],
      });
    }
    return output;
  };
};
