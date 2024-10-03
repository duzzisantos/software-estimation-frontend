function useChartOptions(year: string) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Annual performance score - ${year} `,
      },
    },
  };
  return options;
}

export default useChartOptions;
