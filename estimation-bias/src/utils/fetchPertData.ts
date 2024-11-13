interface AnalysisProperties {
  optimistic: number;
  most_likely: number;
  pessimistic: number;
}

const url: string = import.meta.env.VITE_API_URL_TRAINING;

async function fetchPertData(postObject: AnalysisProperties) {
  try {
    const response = await fetch(`${url}/PertAnalysis`, {
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
