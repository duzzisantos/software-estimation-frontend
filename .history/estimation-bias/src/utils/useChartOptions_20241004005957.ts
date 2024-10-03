function useChartOptions(year: string) {
  const options = {
    responsive: true,
    plugins: {
      // legend: {
      //   position: "top",
      // },
      title: {
        display: true,
        text: ` Predicted durations for 29 tasks per period ${year} `,
      },
    },
  };
  return options;
}

export default useChartOptions;
