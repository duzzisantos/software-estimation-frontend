const PALETTE = [
  "#E84D8A",
  "#2EB086",
  "#FEB326",
  "#6A4CDB",
  "#E55934",
  "#1B9AAA",
  "#CC5A71",
  "#4CB944",
  "#F7B32B",
  "#3D5A80",
  "#EE6C4D",
  "#8338EC",
  "#06D6A0",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#D4A373",
  "#9B5DE5",
  "#00BBF9",
  "#F15BB5",
  "#FEE440",
  "#00F5D4",
  "#7B2D8E",
  "#FB8500",
  "#219EBC",
  "#8AC926",
  "#FF595E",
  "#1982C4",
  "#6A994E",
];

const getColor = (index: number): string => PALETTE[index % PALETTE.length];

export { PALETTE, getColor };
export default getColor;
