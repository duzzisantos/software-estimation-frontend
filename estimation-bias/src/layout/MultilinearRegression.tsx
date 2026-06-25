import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Target,
  Crosshair,
  AlertTriangle,
  History,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { TaskFilter } from "@/components/task-filter";
import { AnalysisCard } from "@/components/analysis-card";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
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
import { TOOLTIP_STYLE, AXIS_TICK, AXIS_LABEL_STYLE, GRID_STROKE } from "../utils/chartConfig";
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

  return (
    <div className="space-y-6">
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
        <EmptyState
          icon={Layers}
          title="No regression results yet"
          description="Train the model to see insights"
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Target}
              iconClassName="text-blue-500"
              label="R² Score"
              value={latest.r_squared.toFixed(4)}
              badge={{
                text: `${rSquaredLevel(latest.r_squared).label} Fit`,
                variant: rSquaredLevel(latest.r_squared).variant,
              }}
            />
            <StatCard
              icon={Crosshair}
              iconClassName="text-violet-500"
              label="Intercept"
              value={latest.intercept.toFixed(2)}
              badge={{ text: "Baseline", variant: "secondary" }}
            />
            <StatCard
              icon={AlertTriangle}
              iconClassName="text-amber-500"
              label="Mean Residual"
              value={meanAbsResidual.toFixed(2)}
              badge={{ text: "Avg Error", variant: "secondary" }}
            />
            <StatCard
              icon={History}
              iconClassName="text-emerald-500"
              label="Training Runs"
              value={data.length}
              badge={{ text: "History", variant: "secondary" }}
            />
          </div>

          <AnalysisCard
            title="Feature Coefficients — Task Impact on Total Duration"
            description="Standardized coefficients show how much each task category influences total project duration."
            action={
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
            }
          >
            {filteredCoefficients.length > 0 ? (
              <ResponsiveContainer width="100%" height={420}>
                <BarChart
                  data={filteredCoefficients}
                  layout="vertical"
                  margin={{ top: 10, right: 30, bottom: 10, left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                  <XAxis type="number" tick={AXIS_TICK} />
                  <YAxis
                    type="category"
                    dataKey="task"
                    width={130}
                    tick={{ ...AXIS_TICK, fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      ...TOOLTIP_STYLE,
                      textTransform: "capitalize",
                    }}
                  />
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
              <EmptyState title="No tasks selected — use the filter to show tasks" />
            )}
          </AnalysisCard>

          <AnalysisCard
            title="Predicted vs Actual Total Duration"
            description="Points close to the diagonal line indicate accurate predictions."
          >
            <ResponsiveContainer width="100%" height={380}>
              <ScatterChart
                margin={{ top: 15, right: 30, bottom: 30, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis
                  type="number"
                  dataKey="actual"
                  name="Actual"
                  tick={AXIS_TICK}
                  label={{
                    value: "Actual Duration",
                    position: "insideBottom",
                    offset: -15,
                    ...AXIS_LABEL_STYLE,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="predicted"
                  name="Predicted"
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
                <Legend wrapperStyle={{ paddingTop: 25, fontSize: "11px" }} />
                <Scatter name="Samples" data={scatterData} fill="#a78bfa" />
              </ScatterChart>
            </ResponsiveContainer>
          </AnalysisCard>

          <AnalysisCard
            title="Residuals — Prediction Errors"
            description="Residuals should be randomly distributed around zero for a well-fitted model."
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={residualData}
                margin={{ top: 10, right: 30, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis
                  dataKey="index"
                  label={{
                    value: "Sample",
                    position: "insideBottom",
                    offset: -10,
                    ...AXIS_LABEL_STYLE,
                  }}
                  tick={AXIS_TICK}
                />
                <YAxis
                  label={{
                    value: "Residual",
                    angle: -90,
                    position: "insideLeft",
                    ...AXIS_LABEL_STYLE,
                  }}
                  tick={AXIS_TICK}
                />
                <Tooltip
                  contentStyle={{
                    ...TOOLTIP_STYLE,
                    textTransform: "capitalize",
                  }}
                />
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
          </AnalysisCard>

          <AnalysisCard
            title="Top Influential Features"
            description="Tasks taking longer time to fulfill"
          >
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
                    <TableCell className="font-medium text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="capitalize font-medium">
                      {item.task}
                    </TableCell>
                    <TableCell className="font-mono text-sm tabular-nums">
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
          </AnalysisCard>
        </>
      )}
    </div>
  );
};

export default MultilinearRegression;
