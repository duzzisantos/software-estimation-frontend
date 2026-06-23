import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PALETTE } from "../utils/generateRandomColors";
import { useChartData } from "../utils/useChartData";

const TimeSeriesChart = () => {
  const { responseData, chartData } = useChartData();

  if (!chartData.data.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        No training data available yet
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 mt-2 text-xs text-muted-foreground">
        Predicted durations across {responseData.length} training periods — last
        6 shown
      </p>
      <ResponsiveContainer width="100%" height={460}>
        <LineChart
          data={chartData.data}
          margin={{ top: 10, right: 20, bottom: 80, left: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
          />
          <XAxis
            dataKey="task"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            label={{
              value: "Predicted Duration",
              angle: -90,
              position: "insideLeft",
              fill: "hsl(var(--muted-foreground))",
            }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--popover))",
              color: "hsl(var(--popover-foreground))",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          {chartData.dateKeys.map((key, idx) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={PALETTE[idx % PALETTE.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;
