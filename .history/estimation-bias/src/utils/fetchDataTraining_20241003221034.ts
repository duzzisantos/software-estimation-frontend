async function createWorkLogs() {
  try {
    const response = await fetch("http://localhost:8000/StoreTrainedResults", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Allow: "GET",
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

export default createWorkLogs;
