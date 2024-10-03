import { Dispatch, SetStateAction } from "react";
import { TaskInput } from "../forms/FormFactory";
import { Button, Col, Form } from "react-bootstrap";
import { tasks } from "../utils/data";
import createWorkLogs from "../utils/fetchTimeSeriesData";

// Define a strict Task type
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
    const obj: any = {};

    for (let i = 0; i < selectedNewTasks.length; i++) {
      const [key, value] = [
        selectedNewTasks[i].taskName,
        selectedNewTasks[i].timeEstimate,
      ];
      obj[key] = value;
    }
    return obj;
  };

  console.log(postObject());
  const handleSubmitTasks = async () => {
    try {
      const res = await createWorkLogs(postObject());
      return console.log(res);
    } catch (err) {
      return console.warn(err);
    }
  };

  return (
    <Col className="my-4 p-4">
      <h2 className="h5 mx-2 fw-normal">
        Select tasks for Time Series Analysis
      </h2>

      <div className="d-flex flex-fill hstack gap-2 flex-md-wrap flex-sm-wrap p-2">
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

      <Form className="d-flex flex-column gap-3 bg-light-subtle my-3 p-2">
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
    </Col>
  );
};

export default TimeSeriesAnalysis;
