import { Dispatch, SetStateAction } from "react";
import { TaskInput } from "../forms/FormFactory";
import { Button, Col, Form } from "react-bootstrap";
import { tasks } from "../utils/data";
import createWorkLogs from "../utils/fetchTimeSeriesData";
import {
  fetchDataTraining,
  storeDataTraining,
} from "../utils/fetchDataTraining";
import formatDate from "../utils/formatDate";
import TimeSeriesChart from "../graphs/TimeSeriesChart";

// Define a strict Task type
interface Task {
  taskName: string;
  timeEstimate: number;
}

// Define the type for `obj`
interface PostObject {
  [taskName: string]: number | string; // Dynamic keys based on `taskName`, with values of either `number` or `string`
  last_updated: string;
  submitted_by: string;
}

interface FormSelection {
  selectedNewTasks: Task[];
  setSelectedNewTasks: Dispatch<SetStateAction<Task[]>>;
}

const TimeSeriesAnalysis = ({
  selectedNewTasks,
  setSelectedNewTasks,
}: FormSelection) => {
  // Handle task selection, adding/removing task objects
  const handleSelectedTasks = (newTaskName: string) => {
    setSelectedNewTasks((prevTasks) => {
      const taskExists = prevTasks.find(
        (task) => task.taskName === newTaskName
      );

      if (taskExists) {
        // Remove the task if it exists
        return prevTasks.filter((task) => task.taskName !== newTaskName);
      } else {
        // Add a new task with a default time estimate
        return [...prevTasks, { taskName: newTaskName, timeEstimate: 0.0 }];
      }
    });
  };

  // Update the time estimate of a task
  const updateTaskTime = (taskName: string, newTimeEstimate: number) => {
    setSelectedNewTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskName === taskName
          ? { ...task, timeEstimate: newTimeEstimate }
          : task
      )
    );
  };

  const postObject = () => {
    const obj: PostObject = {
      last_updated: formatDate(),
      submitted_by: "Harry West",
    };

    for (let i = 0; i < selectedNewTasks.length; i++) {
      const [key, value] = [
        selectedNewTasks[i].taskName,
        selectedNewTasks[i].timeEstimate,
      ];
      obj[key] = value;
    }

    return obj;
  };

  const handleSubmitTasks = async () => {
    try {
      const res = await createWorkLogs(postObject());
      return console.log(res);
    } catch (err) {
      return console.warn(err);
    }
  };

  const handleRetrainData = async () => {
    try {
      const res = await fetchDataTraining();
      return console.log(res.status);
    } catch (err) {
      return console.error(err);
    }
  };

  const handleStoreData = async () => {
    try {
      const res = await storeDataTraining();
      return console.log(res.status);
    } catch (err) {
      return console.error(err);
    }
  };

  return (
    <Col className="my-3 p-3">
      <Button
        variant="primary"
        size="sm"
        className="my-3"
        onClick={handleRetrainData}
      >
        Retrain Data
      </Button>
      <Button
        variant="primary"
        size="sm"
        className="my-3 mx-2"
        onClick={handleStoreData}
      >
        Update Trained Data
      </Button>

      <h2 className="h5 fw-normal">Select tasks for Time Series Analysis</h2>

      <div className="d-flex flex-fill form-generate hstack gap-2 flex-md-wrap flex-sm-wrap p-4 rounded-2 shadow-lg">
        {tasks.map((task) => (
          <Form.Group
            key={task}
            className="bg-info-subtle fw-light rounded-3 hstack gap-2 p-2"
          >
            <Form.Label className="text-capitalize">
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

      <Form className="d-flex flex-column gap-3 bg-light-subtle my-3 p-4 rounded-2 shadow-lg">
        <h2 className="fw-normal h5">Provide Work Logs</h2>
        <Col
          lg={6}
          className="py-3 px-2 bg-light fw-light border-start border-5 border-primary"
        >
          Note: For every selected task, you are to provide an estimated time in
          non-decimal format. Example:{" "}
          <em>
            <strong>Data Backup Task - 100 minutes</strong>
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
        {selectedNewTasks.length > 0 ? (
          <div className="mw-100 gap-2 hstack ">
            <Button size="sm" onClick={handleSubmitTasks}>
              Submit Tasks
            </Button>
          </div>
        ) : null}
      </Form>

      <Col className="p-4 rounded-2 shadow-lg fw-normal">
        <h2 className="h5">Estimation Result Analysis</h2>
        <p>
          Select specific periods or nearest dates to see trained estimated
          times for completing project tasks
        </p>
        <TimeSeriesChart />
      </Col>
    </Col>
  );
};

export default TimeSeriesAnalysis;
