const generateRandomColors = (currentIndex: number) => {
  const r = Math.floor(
    Math.random() * 200 + Math.pow(currentIndex, currentIndex)
  );
  const g = Math.floor(
    Math.random() * 200 + Math.pow(currentIndex, currentIndex)
  );
  const b = Math.floor(
    Math.random() * 200 + Math.pow(currentIndex, currentIndex)
  );
  const randomColor = `rgb(${r}, ${g}, ${b})`;

  return randomColor;
};

export default generateRandomColors;
