const url: string = import.meta.env.VITE_API_URL_TRAINING;
const isProd: boolean = import.meta.env.PROD;

async function fetchDataTraining() {
  try {
    const response = await fetch(
      isProd ? `${url}/Retrain` : "http://localhost:8000/Retrain",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Allow: "POST",
        },
      }
    );

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
    const response = await fetch(
      isProd
        ? `${url}/StoreTrainedResults`
        : "http://localhost:8000/StoreTrainedResults",
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
      return data;
    }
  } catch (error: unknown) {
    console.error(error);
  }
}

export { fetchDataTraining, storeDataTraining };
