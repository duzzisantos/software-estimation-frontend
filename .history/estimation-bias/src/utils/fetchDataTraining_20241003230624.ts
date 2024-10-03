async function fetchDataTraining() {
  try {
    const response = await fetch("http://localhost:8000/Retrain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Allow: "POST",
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

export default fetchDataTraining;
