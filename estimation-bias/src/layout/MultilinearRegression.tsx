import { Alert, Badge, Button, Col, Row, Table } from "react-bootstrap";
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
  if (r2 >= 0.9) return { label: "Excellent", color: "success" };
  if (r2 >= 0.7) return { label: "Good", color: "info" };
  if (r2 >= 0.5) return { label: "Moderate", color: "warning" };
  return { label: "Weak", color: "danger" };
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

  return (
    <Col className="my-4 p-3">
      <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
        <Button
          variant="primary"
          size="sm"
          onClick={handleTrain}
          disabled={training}
        >
          {training ? "Training..." : "Train Regression Model"}
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Results"}
        </Button>
        {latest && (
          <span className="text-muted" style={{ fontSize: "0.85rem" }}>
            Last trained: {new Date(latest.training_date).toLocaleString()}{" "}
            &middot; {latest.sample_count} samples
          </span>
        )}
      </div>

      {!latest ? (
        <Alert variant="info" className="border-0 fw-normal">
          No regression results yet — train the model to see insights
        </Alert>
      ) : (
        <>
          <Row className="g-3 mb-4">
            <Col md={3}>
              <div className="p-3 border rounded-3 shadow-sm text-center">
                <div className="text-muted fw-light mb-1" style={{ fontSize: "0.8rem" }}>
                  R² Score
                </div>
                <h3 className="mb-1">{latest.r_squared.toFixed(4)}</h3>
                <Badge bg={rSquaredLevel(latest.r_squared).color}>
                  {rSquaredLevel(latest.r_squared).label} Fit
                </Badge>
              </div>
            </Col>
            <Col md={3}>
              <div className="p-3 border rounded-3 shadow-sm text-center">
                <div className="text-muted fw-light mb-1" style={{ fontSize: "0.8rem" }}>
                  Intercept
                </div>
                <h3 className="mb-1">{latest.intercept.toFixed(2)}</h3>
                <Badge bg="secondary">Baseline</Badge>
              </div>
            </Col>
            <Col md={3}>
              <div className="p-3 border rounded-3 shadow-sm text-center">
                <div className="text-muted fw-light mb-1" style={{ fontSize: "0.8rem" }}>
                  Mean Residual
                </div>
                <h3 className="mb-1">{meanAbsResidual.toFixed(2)}</h3>
                <Badge bg="secondary">Avg Error</Badge>
              </div>
            </Col>
            <Col md={3}>
              <div className="p-3 border rounded-3 shadow-sm text-center">
                <div className="text-muted fw-light mb-1" style={{ fontSize: "0.8rem" }}>
                  Training Runs
                </div>
                <h3 className="mb-1">{data.length}</h3>
                <Badge bg="secondary">History</Badge>
              </div>
            </Col>
          </Row>

          {/* Coefficients chart */}
          <div className="border rounded-3 shadow-sm p-3 mb-4">
            <h2 className="h5 fw-normal mb-3">
              Feature Coefficients — Task Impact on Total Duration
            </h2>
            <p className="text-muted" style={{ fontSize: "0.85rem" }}>
              Standardized coefficients show how much each task category
              influences total project duration. Higher absolute values mean
              stronger influence.
            </p>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={coefficientData}
                layout="vertical"
                margin={{ top: 10, right: 30, bottom: 10, left: 140 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="task" width={130} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #ddd" }} />
                <ReferenceLine x={0} stroke="#666" />
                <Bar dataKey="coefficient" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                  {coefficientData.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Predicted vs Actual scatter */}
          <div className="border rounded-3 shadow-sm p-3 mb-4">
            <h2 className="h5 fw-normal mb-3">Predicted vs Actual Total Duration</h2>
            <p className="text-muted" style={{ fontSize: "0.85rem" }}>
              Points close to the diagonal line indicate accurate predictions.
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  type="number"
                  dataKey="actual"
                  name="Actual"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Actual Duration", position: "insideBottom", offset: -15 }}
                />
                <YAxis
                  type="number"
                  dataKey="predicted"
                  name="Predicted"
                  tick={{ fontSize: 11 }}
                  label={{ value: "Predicted Duration", angle: -90, position: "insideLeft" }}
                />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #ddd" }} />
                <Legend />
                <Scatter name="Samples" data={scatterData} fill="#8338EC" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Residuals chart */}
          <div className="border rounded-3 shadow-sm p-3 mb-4">
            <h2 className="h5 fw-normal mb-3">Residuals — Prediction Errors</h2>
            <p className="text-muted" style={{ fontSize: "0.85rem" }}>
              Residuals should be randomly distributed around zero for a
              well-fitted model.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={residualData}
                margin={{ top: 10, right: 30, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="index"
                  label={{ value: "Sample", position: "insideBottom", offset: -10 }}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  label={{ value: "Residual", angle: -90, position: "insideLeft" }}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #ddd" }} />
                <ReferenceLine y={0} stroke="#666" />
                <Bar dataKey="residual" radius={[4, 4, 4, 4]} isAnimationActive={false}>
                  {residualData.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top features table */}
          <div className="border rounded-3 shadow-sm p-3">
            <h2 className="h5 fw-normal mb-3">Top Influential Features</h2>
            <Table striped responsive className="fw-normal">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Task Category</th>
                  <th>Coefficient</th>
                  <th>Impact</th>
                </tr>
              </thead>
              <tbody>
                {coefficientData.slice(0, 10).map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="text-capitalize">{item.task}</td>
                    <td>{item.coefficient.toFixed(4)}</td>
                    <td>
                      <Badge bg={item.coefficient >= 0 ? "success" : "danger"}>
                        {item.coefficient >= 0 ? "Increases" : "Decreases"} total
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </Col>
  );
};

export default MultilinearRegression;
