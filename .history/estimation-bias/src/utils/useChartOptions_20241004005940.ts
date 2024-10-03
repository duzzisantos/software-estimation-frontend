function useChartOptions(year: string) {
  const options = {
    responsive: true,
    plugins: {
      // legend: {
      //   position: "top",
      // },
      title: {
        display: true,
        text: ` Predictions for 29 tasks per period ${year} `,
      },
    },
  };
  return options;
}

export default useChartOptions;
