function useChartOptions(year: string, period: number) {
  const options = {
    responsive: true,
    plugins: {
      // legend: {
      //   position: "top",
      // },
      title: {
        display: true,
        text: ` Predicted durations for 29 after ${period} training periods - trained by Tensorflow and Scikit Learn ${year} `,
      },
    },
  };
  return options;
}

export default useChartOptions;
