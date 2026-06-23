import { Dispatch, SetStateAction } from "react";
import { TaskInput } from "../forms/FormFactory";
import { Alert, Button, Col, Form } from "react-bootstrap";
import { tasks } from "../utils/data";
import { useTimeSeriesData } from "../utils/useTimeSeriesData";
import { PALETTE } from "../utils/generateRandomColors";
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

  return (
    <Col className="my-3 p-3">
      <div className="d-flex gap-2 mb-3">
        <Button variant="primary" size="sm" onClick={handleRetrainData}>
          Retrain Data
        </Button>
        <Button variant="outline-secondary" size="sm" onClick={handleStoreData}>
          Update Trained Data
        </Button>
      </div>

      <h2 className="h5 fw-normal">
        Select all tasks for Time Series Analysis
      </h2>

      <div className="d-flex flex-fill form-generate hstack gap-2 flex-md-wrap flex-sm-wrap p-3 py-4 rounded-3 shadow-sm border">
        {tasks.map((task) => (
          <Form.Group
            key={task}
            className="bg-info-subtle fw-light rounded-3 hstack gap-2 p-2"
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
        <h2 className="fw-normal h5">Provide Work Logs</h2>
        <Col
          lg={6}
          className="py-3 px-2 bg-light fw-light border-start border-5 border-primary rounded-1"
        >
          Note: <b>Select all tasks!</b> For every selected task, provide an
          estimated time in non-decimal format. Example:{" "}
          <em>
            <strong>Data Backup Task - 100</strong>
          </em>
        </Col>
        <div className="d-flex flex-wrap gap-2">
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
        {selectedNewTasks.length > 0 && (
          <div className="mw-100 gap-2 hstack">
            <Button size="sm" onClick={handleSubmitTasks}>
              Submit Tasks
            </Button>
          </div>
        )}
      </Form>

      <Col className="p-3 rounded-3 shadow-sm border fw-normal">
        <h2 className="h5">Estimation Result Analysis</h2>
        <p className="text-muted" style={{ fontSize: "0.85rem" }}>
          Predicted durations across {responseData.length} training periods —
          last 6 shown
        </p>
        {chartData.data.length > 0 ? (
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={chartData.data}
              margin={{ top: 10, right: 20, bottom: 80, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="task"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 9 }}
              />
              <YAxis
                label={{
                  value: "Predicted Duration",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #ddd" }}
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
        ) : (
          <Alert variant="info" className="border-0 fw-normal">
            No training data available yet
          </Alert>
        )}
      </Col>
    </Col>
  );
};

export default TimeSeriesAnalysis;
