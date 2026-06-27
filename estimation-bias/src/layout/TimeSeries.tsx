import { Dispatch, SetStateAction, useMemo } from "react";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";
import { Task, formatTaskName } from "@/types";
import { useTaskSelection } from "@/hooks/useTaskSelection";
import { TaskInput } from "../forms/FormFactory";
import { tasks } from "../utils/data";
import { useTimeSeriesData } from "../utils/useTimeSeriesData";
import { TaskMultiSelect } from "@/components/task-multiselect";
import { TaskFilter } from "@/components/task-filter";
import { InfoBanner } from "@/components/info-banner";
import { AnalysisCard } from "@/components/analysis-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  TOOLTIP_STYLE,
  AXIS_TICK,
  AXIS_LABEL_STYLE,
  GRID_STROKE,
} from "../utils/chartConfig";
import { PALETTE } from "../utils/generateRandomColors";

interface FormSelection {
  selectedNewTasks: Task[];
  setSelectedNewTasks: Dispatch<SetStateAction<Task[]>>;
  userName: string;
}

const TimeSeriesAnalysis = ({
  selectedNewTasks,
  setSelectedNewTasks,
  userName,
}: FormSelection) => {
  const {
    responseData,
    chartData,
    updateTaskTime,
    handleSubmitTasks,
    handleRetrainData,
    handleStoreData,
  } = useTimeSeriesData(selectedNewTasks, setSelectedNewTasks, userName);

  const {
    visibleTasks,
    onTaskToggle,
    onSelectAll,
    onClearAll,
    toggleVisibility,
    showAllVisible,
    hideAllVisible,
  } = useTaskSelection({
    selectedTasks: selectedNewTasks,
    setSelectedTasks: setSelectedNewTasks,
  });

  const filteredChartData = useMemo(() => {
    if (!chartData.data.length)
      return { data: [], dateKeys: chartData.dateKeys };
    const filtered = chartData.data.filter((point) => {
      const taskKey = String(point.task).split(" ").join("_");
      return visibleTasks.has(taskKey);
    });
    return { data: filtered, dateKeys: chartData.dateKeys };
  }, [chartData, visibleTasks]);

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
      <div className="flex gap-2">
        <Button size="sm" onClick={onRetrain}>
          Retrain Data
        </Button>
        <Button variant="outline" size="sm" onClick={onStoreData}>
          Update Trained Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Series Analysis — Work Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <InfoBanner variant="cyan">
            <strong className="text-foreground">Select all tasks!</strong> For
            every selected task, provide an estimated time in non-decimal format.
            Example:{" "}
            <strong className="text-foreground">Data Backup Task — 100</strong>
          </InfoBanner>

          <TaskMultiSelect
            allTasks={tasks}
            selectedTasks={selectedNewTasks.map((t) => t.taskName)}
            onToggle={onTaskToggle}
            onSelectAll={onSelectAll}
            onClearAll={onClearAll}
            accentColor="cyan"
          />

          {selectedNewTasks.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {selectedNewTasks.map((task, index) => (
                  <TaskInput
                    key={index}
                    taskName={formatTaskName(task.taskName)}
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

      <AnalysisCard
        title="Estimation Result Analysis"
        description={`Predicted durations across ${responseData.length} training periods — last 6 shown`}
        action={
          <TaskFilter
            tasks={tasks}
            visibleTasks={visibleTasks}
            onToggle={toggleVisibility}
            onShowAll={showAllVisible}
            onHideAll={hideAllVisible}
          />
        }
      >
        {filteredChartData.data.length > 0 ? (
          <ResponsiveContainer width="100%" height={450}>
            <LineChart
              data={filteredChartData.data}
              margin={{ top: 10, right: 20, bottom: 80, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis
                dataKey="task"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ ...AXIS_TICK, fontSize: 10 }}
              />
              <YAxis
                tick={AXIS_TICK}
                label={{
                  value: "Predicted Duration",
                  angle: -90,
                  position: "insideLeft",
                  ...AXIS_LABEL_STYLE,
                }}
              />
              <Tooltip
                contentStyle={{
                  ...TOOLTIP_STYLE,
                  textTransform: "capitalize",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 10, fontSize: "11px" }} />
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
          <EmptyState
            icon={TrendingUp}
            title="No training data available"
            description="Retrain the model to generate predictions"
          />
        )}
      </AnalysisCard>
    </div>
  );
};

export default TimeSeriesAnalysis;
