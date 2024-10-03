function useChartOptions(year: string) {
  const options = {
    responsive: true,
    plugins: {
      // legend: {
      //   position: "top",
      // },
      title: {
        display: true,
        text: ` Predicted durations for 29 tasks per period - trained by Tensorflow and Scikit Learn ${year} `,
      },
    },
  };
  return options;
}

export default useChartOptions;
