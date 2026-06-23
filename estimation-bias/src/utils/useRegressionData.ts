import { useEffect, useState, useMemo, useCallback } from "react";
import {
  RegressionData,
  fetchRegressionResults,
  trainRegression,
} from "./fetchRegressionData";
import { PALETTE } from "./generateRandomColors";

export function useRegressionData() {
  const [data, setData] = useState<RegressionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const results = await fetchRegressionResults();
      setData(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTrain = useCallback(async () => {
    setTraining(true);
    try {
      await trainRegression();
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setTraining(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const latest = data.length > 0 ? data[data.length - 1] : null;

  const coefficientData = useMemo(() => {
    if (!latest) return [];
    return latest.task_categories
      .map((cat, i) => ({
        task: cat.split("_").join(" "),
        coefficient: latest.coefficients[i],
        absCoeff: Math.abs(latest.coefficients[i]),
        fill: latest.coefficients[i] >= 0 ? PALETTE[1] : PALETTE[0],
      }))
      .sort((a, b) => b.absCoeff - a.absCoeff);
  }, [latest]);

  const scatterData = useMemo(() => {
    if (!latest) return [];
    return latest.actual_totals.map((actual, i) => ({
      actual,
      predicted: latest.predicted_totals[i],
      fill: PALETTE[i % PALETTE.length],
    }));
  }, [latest]);

  const residualData = useMemo(() => {
    if (!latest) return [];
    return latest.residuals.map((r, i) => ({
      index: i + 1,
      residual: r,
      fill: r >= 0 ? PALETTE[4] : PALETTE[5],
    }));
  }, [latest]);

  const meanAbsResidual = useMemo(() => {
    if (!latest) return 0;
    return (
      latest.residuals.reduce((a, b) => a + Math.abs(b), 0) /
      latest.residuals.length
    );
  }, [latest]);

  return {
    data,
    latest,
    loading,
    training,
    coefficientData,
    scatterData,
    residualData,
    meanAbsResidual,
    fetchData,
    handleTrain,
  };
}
