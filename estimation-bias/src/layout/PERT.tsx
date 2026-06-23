import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { toast } from "sonner";
import { TaskInput } from "../forms/FormFactory";
import { tasks } from "../utils/data";
import { usePertAnalysis } from "../utils/usePertAnalysis";
import MonteCarloTable from "../tables/MonteCarloTable";
import { TaskFilter } from "@/components/task-filter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PALETTE } from "../utils/generateRandomColors";

interface Task {
  taskName: string;
  timeEstimate: number;
}

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
    handleSelectedTasks,
    updateTaskTime,
    handleSubmit,
  } = usePertAnalysis(selectedTasks, setSelectedTasks);

  const [visibleTasks, setVisibleTasks] = useState<Set<string>>(
    () => new Set(tasks)
  );

  const filteredChartData = useMemo(() => {
    return chartData;
  }, [chartData]);

  const onTaskToggle = (taskName: string) => {
    handleSelectedTasks(taskName);
    const isAdding = !selectedTasks.find((t) => t.taskName === taskName);
    toast(
      isAdding
        ? `Added ${taskName.split("_").join(" ")}`
        : `Removed ${taskName.split("_").join(" ")}`,
      { icon: isAdding ? "+" : "-" }
    );
  };

  const onSubmit = async () => {
    if (optimistic <= 0 || pessimistic <= 0) {
      toast.error("Please provide both optimistic and pessimistic times");
      return;
    }
    if (pessimistic <= totalMostLikelyTime) {
      toast.warning(
        "Pessimistic time should be greater than most likely time"
      );
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
      {/* Task Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Select tasks for PERT Analysis run by Monte Carlo Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tasks.map((task) => {
              const isSelected = selectedTasks.some(
                (t) => t.taskName === task
              );
              return (
                <label
                  key={task}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                    isSelected
                      ? "border-blue-400/50 bg-blue-400/10 text-blue-700 dark:text-blue-300"
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

      {/* Estimates Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Provide Estimates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border-l-4 border-blue-400 bg-blue-400/5 px-4 py-3 text-sm text-muted-foreground">
            For every selected task, provide an estimated time. Example:{" "}
            <strong className="text-foreground">
              Styling Task — 120 minutes.
            </strong>{" "}
            Pessimistic time must be greater than optimistic and most likely
            time.
          </div>

          {selectedTasks.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {selectedTasks.map((task, index) => (
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

              <div className="border-t pt-5">
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
                      className="w-52"
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
                      className="w-52"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Optimistic:
                  </span>
                  <Badge variant="success">{optimistic}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Most Likely:
                  </span>
                  <Badge variant="info">{totalMostLikelyTime}</Badge>
                  <span className="text-sm text-muted-foreground">
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

      {/* Results */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">
            Estimation Analysis Result
          </CardTitle>
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
          <Tabs defaultValue="table">
            <TabsList>
              <TabsTrigger value="chart">Distribution Chart</TabsTrigger>
              <TabsTrigger value="table">Result Table</TabsTrigger>
            </TabsList>

            <TabsContent value="chart">
              {filteredChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={460}>
                  <BarChart
                    data={filteredChartData}
                    margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="range"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      label={{
                        value: "Duration Range",
                        position: "insideBottom",
                        offset: -50,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      label={{
                        value: "Frequency",
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
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  Run a simulation to see the distribution chart
                </div>
              )}
            </TabsContent>

            <TabsContent value="table">
              {results !== undefined ? (
                <MonteCarloTable result={results} />
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  No results to show yet
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PERTAnalysis;
