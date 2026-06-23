export interface RegressionData {
  task_categories: string[];
  coefficients: number[];
  intercept: number;
  r_squared: number;
  predicted_totals: number[];
  actual_totals: number[];
  residuals: number[];
  sample_count: number;
  training_date: string;
}

const url: string = import.meta.env.VITE_API_URL_TRAINING;

async function fetchRegressionResults(): Promise<RegressionData[]> {
  const response = await fetch(`${url}/GetRegressionResults`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`${response.status}, Cause: ${response.type}`);
  }
  return response.json();
}

async function trainRegression(): Promise<{ id: string }> {
  const response = await fetch(`${url}/StoreRegressionResults`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`${response.status}, Cause: ${response.type}`);
  }
  return response.json();
}

export { fetchRegressionResults, trainRegression };
