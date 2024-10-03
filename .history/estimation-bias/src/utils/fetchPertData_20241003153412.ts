interface AnalysisProperties {
  optimistic: number;
  most_likely: number;
  pessimistic: number;
}

async function fetchPertData(postObject: AnalysisProperties) {
  try {
    const response = await window.fetch("http://localhost:8000/PertAnalysis", {
      method: "POST",
      body: JSON.stringify(postObject),
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

export default fetchPertData;
