import { getAuthHeaders } from "./authHeaders";

const url: string = import.meta.env.VITE_API_URL_TRAINING;

async function fetchDataTraining() {
  try {
    const response = await fetch(`${url}/Retrain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Allow: "POST",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok || response.status !== 200) {
      throw new Error(`${response.status}, Cause: ${response.type}`);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error: unknown) {
    console.error(error);
  }
}

async function storeDataTraining() {
  try {
    const response = await fetch(`${url}/StoreTrainedResults`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Allow: "GET",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok || response.status !== 200) {
      throw new Error(`${response.status}, Cause: ${response.type}`);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error: unknown) {
    console.error(error);
  }
}

export { fetchDataTraining, storeDataTraining };
