interface AnalysisProperties {
    optimistic: number
    most_likely: number
    pessimistic: number
}







async function fetchPertData(postObject: AnalysisProperties){
  try{
    const response = await window.fetch('http://localhost:8000/PertAnalaysis', {
        method: 'POST',
        body: JSON.stringify(postObject)
      })

      if(!response.ok || response.status !== 200){
        throw new Error(`Status${response.status}, Cause: ${response.type}`)
      }
  }
}