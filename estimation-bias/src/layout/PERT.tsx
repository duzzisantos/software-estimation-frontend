import { Dispatch, SetStateAction } from "react";
import { TaskInput } from "../forms/FormFactory";
import { Alert, Badge, Button, Col, Form, Tab, Tabs } from "react-bootstrap";
import { tasks } from "../utils/data";
import { usePertAnalysis } from "../utils/usePertAnalysis";
import MonteCarloTable from "../tables/MonteCarloTable";
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
    apiResponse,
    hasSubmitted,
    chartData,
    totalMostLikelyTime,
    handleSelectedTasks,
    updateTaskTime,
    handleSubmit,
  } = usePertAnalysis(selectedTasks, setSelectedTasks);

  return (
    <Col className="my-4 p-3">
      <h2 className="h5 fw-normal">
        Select tasks for PERT Analysis run by Monte Carlo Simulation
      </h2>

      <div className="d-flex flex-fill form-generate hstack gap-2 rounded-3 shadow-sm flex-md-wrap flex-sm-wrap p-3 py-4 border">
        {tasks.map((task) => (
          <Form.Group
            key={task}
            className="bg-primary-subtle text-dark fw-light rounded-3 hstack gap-2 p-2"
          >
            <Form.Label className="text-capitalize mb-0">
              {task.split("_").join(" ")}
            </Form.Label>
            <Form.Check
              type="switch"
              value={task}
              onChange={() => handleSelectedTasks(task)}
            />
          </Form.Group>
        ))}
      </div>

      <Form className="d-flex flex-column gap-3 bg-light-subtle my-4 p-3 rounded-2 shadow-sm border">
        <h2 className="fw-normal h5">Provide Estimates</h2>
        <Col
          lg={6}
          className="py-3 px-2 bg-light fw-light border-start border-5 border-primary rounded-1"
        >
          Note: For every selected task, provide an estimated time. Example:{" "}
          <em>
            <strong>Styling Task - 120 minutes.</strong>
          </em>{" "}
          Pessimistic time must be greater than optimistic and most likely time.
        </Col>
        <div className="d-flex flex-wrap gap-2">
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
        {selectedTasks.length > 0 && (
          <Col className="bg-light-subtle py-3 d-flex flex-column gap-3 fw-normal border-top border-dark-subtle border-2 my-3">
            <div className="hstack gap-5 flex-wrap">
              <Form.Group>
                <Form.Label>
                  Optimistic Time{" "}
                  <small className="text-danger">* required</small>
                </Form.Label>
                <Form.Control
                  required
                  type="number"
                  min={0}
                  placeholder="Enter optimistic time"
                  value={optimistic}
                  onChange={(e) => setOptimistic(parseFloat(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Pessimistic Time{" "}
                  <small className="text-danger">* required</small>
                </Form.Label>
                <Form.Control
                  required
                  type="number"
                  min={0}
                  placeholder="Enter pessimistic time"
                  value={pessimistic}
                  onChange={(e) => setPessimistic(parseFloat(e.target.value))}
                />
              </Form.Group>
            </div>
            <div className="hstack gap-4 flex-wrap">
              <output>
                Optimistic:{" "}
                <Badge bg="success" pill>
                  {optimistic}
                </Badge>
              </output>
              <output>
                Most Likely:{" "}
                <Badge bg="info" className="text-dark" pill>
                  {totalMostLikelyTime}
                </Badge>
              </output>
              <output>
                Pessimistic:{" "}
                <Badge bg="danger" pill>
                  {pessimistic}
                </Badge>
              </output>
            </div>
          </Col>
        )}
        {selectedTasks.length > 0 && (
          <div className="mw-100 gap-2 hstack">
            <Button
              onClick={handleSubmit}
              className={
                hasSubmitted && apiResponse === 200
                  ? "bg-success border-success"
                  : ""
              }
            >
              Submit Estimates
            </Button>
          </div>
        )}
      </Form>

      <Col className="my-4 shadow-sm rounded-3 p-3 border">
        <h2 className="h5 fw-normal">Estimation Analysis Result</h2>
        <Tabs defaultActiveKey={"table"} variant="underline">
          <Tab eventKey={"chart"} title="Distribution Chart">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="range"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 10 }}
                    label={{
                      value: "Duration Range",
                      position: "insideBottom",
                      offset: -50,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Frequency",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #ddd",
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
              <Alert variant="info" className="border-0 mt-3 fw-normal">
                Run a simulation to see the distribution chart
              </Alert>
            )}
          </Tab>
          <Tab eventKey={"table"} title="Result Table">
            {results !== undefined ? (
              <MonteCarloTable result={results} />
            ) : (
              <Alert variant="info" className="border-0 mt-3 fw-normal">
                No results to show yet
              </Alert>
            )}
          </Tab>
        </Tabs>
      </Col>
    </Col>
  );
};

export default PERTAnalysis;
