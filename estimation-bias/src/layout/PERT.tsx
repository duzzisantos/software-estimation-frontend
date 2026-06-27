import { Dispatch, SetStateAction, useMemo } from "react";
import { toast } from "sonner";
import { BarChart3, TableIcon } from "lucide-react";
import { Task, formatTaskName } from "@/types";
import { useTaskSelection } from "@/hooks/useTaskSelection";
import { TaskInput } from "../forms/FormFactory";
import { tasks } from "../utils/data";
import { usePertAnalysis } from "../utils/usePertAnalysis";
import MonteCarloTable from "../tables/MonteCarloTable";
import { TaskMultiSelect } from "@/components/task-multiselect";
import { TaskFilter } from "@/components/task-filter";
import { InfoBanner } from "@/components/info-banner";
import { AnalysisCard } from "@/components/analysis-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  selectedTasks: Task[];
  setSelectedTasks: Dispatch<SetStateAction<Task[]>>;
}

const PERTAnalysis = ({ selectedTasks, setSelectedTasks }: FormSelection) => {
  const {
    optimistic,
    setOptimistic,
    pessimistic,
    setPessimistic,
    results,
    chartData,
    totalMostLikelyTime,
    updateTaskTime,
    handleSubmit,
  } = usePertAnalysis(selectedTasks, setSelectedTasks);

  const {
    visibleTasks,
    onTaskToggle,
    onSelectAll,
    onClearAll,
    toggleVisibility,
    showAllVisible,
    hideAllVisible,
  } = useTaskSelection({ selectedTasks, setSelectedTasks });

  const filteredChartData = useMemo(() => chartData, [chartData]);

  const onSubmit = async () => {
    if (optimistic <= 0 || pessimistic <= 0) {
      toast.error("Please provide both optimistic and pessimistic times");
      return;
    }
    if (pessimistic <= totalMostLikelyTime) {
      toast.warning("Pessimistic time should be greater than most likely time");
    }
    try {
      await handleSubmit();
      toast.success("Monte Carlo simulation complete", {
        description: "Results are ready in the analysis section below",
      });
    } catch {
      toast.error("Simulation failed", {
        description: "Please check your inputs and try again",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PERT Analysis — Monte Carlo Simulation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <InfoBanner>
            Select tasks below and provide an estimated time for each. Example:{" "}
            <strong className="text-foreground">
              Styling Task — 120 minutes.
            </strong>{" "}
            Pessimistic time must exceed optimistic and most likely time.
          </InfoBanner>

          <TaskMultiSelect
            allTasks={tasks}
            selectedTasks={selectedTasks.map((t) => t.taskName)}
            onToggle={onTaskToggle}
            onSelectAll={onSelectAll}
            onClearAll={onClearAll}
            accentColor="blue"
          />

          {selectedTasks.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {selectedTasks.map((task, index) => (
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

              <div className="border-t border-border/30 pt-5">
                <div className="flex flex-wrap items-end gap-6">
                  <div className="space-y-2">
                    <Label>
                      Optimistic Time{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Enter optimistic time"
                      value={optimistic || ""}
                      onChange={(e) =>
                        setOptimistic(parseFloat(e.target.value) || 0)
                      }
                      className="w-52 tabular-nums"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Pessimistic Time{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Enter pessimistic time"
                      value={pessimistic || ""}
                      onChange={(e) =>
                        setPessimistic(parseFloat(e.target.value) || 0)
                      }
                      className="w-52 tabular-nums"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-[13px] text-muted-foreground">
                    Optimistic:
                  </span>
                  <Badge variant="success">{optimistic}</Badge>
                  <span className="text-[13px] text-muted-foreground">
                    Most Likely:
                  </span>
                  <Badge variant="info">{totalMostLikelyTime}</Badge>
                  <span className="text-[13px] text-muted-foreground">
                    Pessimistic:
                  </span>
                  <Badge variant="destructive">{pessimistic}</Badge>
                </div>
              </div>

              <Button onClick={onSubmit}>Submit Estimates</Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Side-by-side: Chart + Table */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AnalysisCard
          title="Distribution Chart"
          action={
            <TaskFilter
              tasks={tasks}
              visibleTasks={visibleTasks}
              onToggle={toggleVisibility}
              onShowAll={showAllVisible}
              onHideAll={hideAllVisible}
            />
          }
          compact
        >
          {filteredChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={380}>
              <BarChart
                data={filteredChartData}
                margin={{ top: 20, right: 15, bottom: 60, left: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis
                  dataKey="range"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ ...AXIS_TICK, fontSize: 9 }}
                  label={{
                    value: "Duration Range",
                    position: "insideBottom",
                    offset: -50,
                    ...AXIS_LABEL_STYLE,
                  }}
                />
                <YAxis
                  tick={AXIS_TICK}
                  label={{
                    value: "Frequency",
                    angle: -90,
                    position: "insideLeft",
                    ...AXIS_LABEL_STYLE,
                  }}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value) => [String(value), "Simulations"]}
                />
                <Bar
                  dataKey="count"
                  fill={PALETTE[3]}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No simulation data"
              description="Run a simulation to see the distribution"
            />
          )}
        </AnalysisCard>

        <AnalysisCard title="Result Table" compact>
          {results !== undefined ? (
            <MonteCarloTable result={results} />
          ) : (
            <EmptyState
              icon={TableIcon}
              title="Nothing to show yet"
              description="Submit estimates to generate results"
            />
          )}
        </AnalysisCard>
      </div>
    </div>
  );
};

export default PERTAnalysis;
