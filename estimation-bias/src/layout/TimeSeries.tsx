import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { toast } from "sonner";
import { TaskInput } from "../forms/FormFactory";
import { tasks } from "../utils/data";
import { useTimeSeriesData } from "../utils/useTimeSeriesData";
import { TaskFilter } from "@/components/task-filter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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

interface Task {
  taskName: string;
  timeEstimate: number;
}

interface FormSelection {
  selectedNewTasks: Task[];
  setSelectedNewTasks: Dispatch<SetStateAction<Task[]>>;
}

const TimeSeriesAnalysis = ({
  selectedNewTasks,
  setSelectedNewTasks,
}: FormSelection) => {
  const {
    responseData,
    chartData,
    handleSelectedTasks,
    updateTaskTime,
    handleSubmitTasks,
    handleRetrainData,
    handleStoreData,
  } = useTimeSeriesData(selectedNewTasks, setSelectedNewTasks);

  const [visibleTasks, setVisibleTasks] = useState<Set<string>>(
    () => new Set(tasks)
  );

  const filteredChartData = useMemo(() => {
    if (!chartData.data.length) return { data: [], dateKeys: chartData.dateKeys };
    const filtered = chartData.data.filter((point) => {
      const taskKey = String(point.task).split(" ").join("_");
      return visibleTasks.has(taskKey);
    });
    return { data: filtered, dateKeys: chartData.dateKeys };
  }, [chartData, visibleTasks]);

  const onTaskToggle = (taskName: string) => {
    handleSelectedTasks(taskName);
    const isAdding = !selectedNewTasks.find((t) => t.taskName === taskName);
    toast(
      isAdding
        ? `Added ${taskName.split("_").join(" ")}`
        : `Removed ${taskName.split("_").join(" ")}`,
      { icon: isAdding ? "+" : "-" }
    );
  };

  const onRetrain = async () => {
    try {
      await handleRetrainData();
      toast.success("Model retrained successfully");
    } catch {
      toast.error("Failed to retrain model");
    }
  };

  const onStoreData = async () => {
    try {
      await handleStoreData();
      toast.success("Training data updated");
    } catch {
      toast.error("Failed to update training data");
    }
  };

  const onSubmitTasks = async () => {
    if (selectedNewTasks.length === 0) {
      toast.warning("Select at least one task before submitting");
      return;
    }
    try {
      await handleSubmitTasks();
      toast.success("Work logs submitted successfully");
    } catch {
      toast.error("Failed to submit work logs");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button size="sm" onClick={onRetrain}>
          Retrain Data
        </Button>
        <Button variant="outline" size="sm" onClick={onStoreData}>
          Update Trained Data
        </Button>
      </div>

      {/* Task Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Select all tasks for Time Series Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tasks.map((task) => {
              const isSelected = selectedNewTasks.some(
                (t) => t.taskName === task
              );
              return (
                <label
                  key={task}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                    isSelected
                      ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-700 dark:text-cyan-300"
                      : "border-transparent bg-muted hover:bg-muted/80"
                  }`}
                >
                  <span className="capitalize">
                    {task.split("_").join(" ")}
                  </span>
                  <Switch
                    checked={isSelected}
                    onCheckedChange={() => onTaskToggle(task)}
                  />
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Work Logs Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Provide Work Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border-l-4 border-blue-400 bg-blue-400/5 px-4 py-3 text-sm text-muted-foreground">
            <strong className="text-foreground">Select all tasks!</strong> For
            every selected task, provide an estimated time in non-decimal
            format. Example:{" "}
            <strong className="text-foreground">
              Data Backup Task — 100
            </strong>
          </div>

          {selectedNewTasks.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {selectedNewTasks.map((task, index) => (
                  <TaskInput
                    key={index}
                    taskName={task.taskName.split("_").join(" ")}
                    taskValue={task.timeEstimate}
                    setTaskValue={(newValue: number) =>
                      updateTaskTime(task.taskName, newValue)
                    }
                  />
                ))}
              </div>
              <Button size="sm" onClick={onSubmitTasks}>
                Submit Tasks
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Results Chart */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">
              Estimation Result Analysis
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Predicted durations across {responseData.length} training periods
              — last 6 shown
            </p>
          </div>
          <TaskFilter
            tasks={tasks}
            visibleTasks={visibleTasks}
            onToggle={(t) =>
              setVisibleTasks((prev) => {
                const next = new Set(prev);
                if (next.has(t)) next.delete(t);
                else next.add(t);
                return next;
              })
            }
            onShowAll={() => setVisibleTasks(new Set(tasks))}
            onHideAll={() => setVisibleTasks(new Set())}
          />
        </CardHeader>
        <CardContent>
          {filteredChartData.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={460}>
              <LineChart
                data={filteredChartData.data}
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
                {filteredChartData.dateKeys.map((key, idx) => (
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
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              No training data available yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSeriesAnalysis;
