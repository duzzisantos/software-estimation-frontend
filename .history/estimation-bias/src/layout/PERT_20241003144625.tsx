import { Dispatch, SetStateAction, useState } from "react";
import { TaskInput } from "../forms/FormFactory";
import { Badge, Button, Col, Form } from "react-bootstrap";
import { tasks } from "../utils/data";

// Define a strict Task type
interface Task {
  taskName: string;
  timeEstimate: number;
}

interface FormSelection {
  selectedTasks: Task[];
  setSelectedTasks: Dispatch<SetStateAction<Task[]>>;
}

const PERTAnalysis = ({ selectedTasks, setSelectedTasks }: FormSelection) => {
  const [optimistic, setOptimistic] = useState(0.0);
  const [pessimistic, setPessimistic] = useState(0.0);
  // Handle task selection, adding/removing task objects
  const handleSelectedTasks = (newTaskName: string) => {
    setSelectedTasks((prevTasks) => {
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
    setSelectedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskName === taskName
          ? { ...task, timeEstimate: newTimeEstimate }
          : task
      )
    );
  };

  console.log(selectedTasks);

  const totalMostLikelyTime = selectedTasks
    .map((element: Task) => element.timeEstimate)
    .reduce((acc, curr) => curr + acc, 0);
  console.log(totalMostLikelyTime);

  return (
    <Col className="my-4 p-4">
      <h2 className="h5 mx-2 fw-normal">
        Select tasks for PERT Analysis run by Monte Carlo Simulation
      </h2>

      <div className="d-flex flex-fill hstack gap-2 flex-md-wrap flex-sm-wrap p-2">
        {tasks.map((task) => (
          <Form.Group
            key={task}
            className="bg-primary-subtle text-dark fw-light rounded-3 hstack gap-2 p-2"
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
          decimal format. Example:{" "}
          <em>
            <strong>Styling Task - 120.0 minutes.</strong>
          </em>{" "}
          Pessimistic time must be greater than optimistic time. The goal is to
          gather data for optimistic, most likely (which is a sum of all the
          estimates you will provide per selected task), and finally the
          pessimistic estimates.
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
        <Col className="bg-secondary-subtle p-3 hstack gap-5">
          <Form.Group>
            <Form.Label>
              Optimistic Time <small className="text-danger">* required</small>
            </Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="Enter optmistic time"
              value={optimistic}
              onChange={(e) => setOptimistic(parseFloat(e.target.value))}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Pessimistic Time <small className="text-danger">* required</small>
            </Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="Enter pessimistic time"
              value={pessimistic}
              onChange={(e) => setPessimistic(parseFloat(e.target.value))}
            />
          </Form.Group>
          <output>
            Optimistic Estimation:{" "}
            <Badge bg="success" pill>
              {100}
            </Badge>
          </output>
          <output>
            Most Likely Estimation:{" "}
            <Badge bg="info" className="text-dark" pill>
              {totalMostLikelyTime}
            </Badge>
          </output>
          <output>
            Pessimistic Estimation:{" "}
            <Badge bg="danger" pill>
              {100}
            </Badge>
          </output>
        </Col>
        {selectedTasks.length > 0 ? (
          <div className="mw-100 gap-2 hstack ">
            <Button size="sm">Submit Tasks</Button>
            <Button size="sm" variant="secondary">
              Clear Form
            </Button>
          </div>
        ) : null}
      </Form>
    </Col>
  );
};

export default PERTAnalysis;
