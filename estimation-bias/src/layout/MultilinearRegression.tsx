import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { TaskFilter } from "@/components/task-filter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
  Legend,
} from "recharts";
import { useRegressionData } from "../utils/useRegressionData";

const rSquaredLevel = (r2: number) => {
  if (r2 >= 0.9) return { label: "Excellent", variant: "success" as const };
  if (r2 >= 0.7) return { label: "Good", variant: "info" as const };
  if (r2 >= 0.5) return { label: "Moderate", variant: "warning" as const };
  return { label: "Weak", variant: "destructive" as const };
};

const MultilinearRegression = () => {
  const {
    data,
    latest,
    loading,
    training,
    coefficientData,
    scatterData,
    residualData,
    meanAbsResidual,
    fetchData,
    handleTrain,
  } = useRegressionData();

  const allTasks = useMemo(
    () => coefficientData.map((c) => c.task.split(" ").join("_")),
    [coefficientData],
  );

  const [visibleTasks, setVisibleTasks] = useState<Set<string>>(
    () => new Set<string>(),
  );

  const initialized = useMemo(() => {
    if (allTasks.length > 0 && visibleTasks.size === 0) {
      return false;
    }
    return true;
  }, [allTasks, visibleTasks.size]);

  const effectiveVisible = useMemo(() => {
    if (!initialized && allTasks.length > 0) {
      return new Set(allTasks);
    }
    return visibleTasks;
  }, [initialized, allTasks, visibleTasks]);

  const filteredCoefficients = useMemo(
    () =>
      coefficientData.filter((c) =>
        effectiveVisible.has(c.task.split(" ").join("_")),
      ),
    [coefficientData, effectiveVisible],
  );

  const onTrain = async () => {
    try {
      await handleTrain();
      toast.success("Regression model trained successfully", {
        description: "Results have been updated below",
      });
    } catch {
      toast.error("Failed to train regression model");
    }
  };

  const onRefresh = async () => {
    try {
      await fetchData();
      toast.success("Results refreshed");
    } catch {
      toast.error("Failed to refresh results");
    }
  };

  const tooltipStyle = {
    borderRadius: 10,
    border: "1px solid hsl(var(--border))",
    background: "hsl(var(--popover))",
    color: "hsl(var(--popover-foreground))",
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={onTrain} disabled={training}>
          {training ? "Training..." : "Train Regression Model"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Results"}
        </Button>
        {latest && (
          <span className="text-xs text-muted-foreground">
            Last trained: {new Date(latest.training_date).toLocaleString()} ·{" "}
            {latest.sample_count} samples
          </span>
        )}
      </div>

      {!latest ? (
        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No regression results yet — train the model to see insights
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-xs text-muted-foreground">R² Score</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {latest.r_squared.toFixed(4)}
                </p>
                <Badge
                  variant={rSquaredLevel(latest.r_squared).variant}
                  className="mt-2"
                >
                  {rSquaredLevel(latest.r_squared).label} Fit
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-xs text-muted-foreground">Intercept</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {latest.intercept.toFixed(2)}
                </p>
                <Badge variant="secondary" className="mt-2">
                  Baseline
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-xs text-muted-foreground">Mean Residual</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {meanAbsResidual.toFixed(2)}
                </p>
                <Badge variant="secondary" className="mt-2">
                  Avg Error
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-xs text-muted-foreground">Training Runs</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">
                  {data.length}
                </p>
                <Badge variant="secondary" className="mt-2">
                  History
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Coefficients Chart */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">
                  Feature Coefficients — Task Impact on Total Duration
                </CardTitle>
                <CardDescription className="mt-1">
                  Standardized coefficients show how much each task category
                  influences total project duration.
                </CardDescription>
              </div>
              <TaskFilter
                tasks={allTasks}
                visibleTasks={effectiveVisible}
                onToggle={(t) => {
                  setVisibleTasks((prev) => {
                    const base =
                      prev.size === 0 ? new Set(allTasks) : new Set(prev);
                    if (base.has(t)) base.delete(t);
                    else base.add(t);
                    return base;
                  });
                }}
                onShowAll={() => setVisibleTasks(new Set(allTasks))}
                onHideAll={() => setVisibleTasks(new Set())}
              />
            </CardHeader>
            <CardContent>
              {filteredCoefficients.length > 0 ? (
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart
                    data={filteredCoefficients}
                    layout="vertical"
                    margin={{ top: 10, right: 30, bottom: 10, left: 100 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      type="number"
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <YAxis
                      type="category"
                      dataKey="task"
                      width={130}
                      tick={{
                        fontSize: 10,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <ReferenceLine
                      x={0}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Bar
                      dataKey="coefficient"
                      radius={[0, 4, 4, 0]}
                      isAnimationActive={false}
                    >
                      {filteredCoefficients.map((entry, i) => (
                        <rect key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  No tasks selected — use the filter to show tasks
                </div>
              )}
            </CardContent>
          </Card>

          {/* Predicted vs Actual Scatter */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Predicted vs Actual Total Duration
              </CardTitle>
              <CardDescription>
                Points close to the diagonal line indicate accurate predictions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={380}>
                <ScatterChart
                  margin={{ top: 10, right: 30, bottom: 30, left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    type="number"
                    dataKey="actual"
                    name="Actual"
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    label={{
                      value: "Actual Duration",
                      position: "insideBottom",
                      offset: -15,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="predicted"
                    name="Predicted"
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    label={{
                      value: "Predicted Duration",
                      angle: -90,
                      position: "insideLeft",
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend className="mt-5" />
                  <Scatter name="Samples" data={scatterData} fill="#a78bfa" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Residuals Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Residuals — Prediction Errors
              </CardTitle>
              <CardDescription>
                Residuals should be randomly distributed around zero for a
                well-fitted model.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={residualData}
                  margin={{ top: 10, right: 30, bottom: 20, left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="index"
                    label={{
                      value: "Sample",
                      position: "insideBottom",
                      offset: -10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Residual",
                      angle: -90,
                      position: "insideLeft",
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                  <Bar
                    dataKey="residual"
                    radius={[4, 4, 4, 4]}
                    isAnimationActive={false}
                  >
                    {residualData.map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Features Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Top Influential Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Task Category</TableHead>
                    <TableHead>Coefficient</TableHead>
                    <TableHead>Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoefficients.slice(0, 10).map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell className="capitalize">{item.task}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.coefficient.toFixed(4)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.coefficient >= 0 ? "success" : "destructive"
                          }
                        >
                          {item.coefficient >= 0 ? "Increases" : "Decreases"}{" "}
                          total
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default MultilinearRegression;
