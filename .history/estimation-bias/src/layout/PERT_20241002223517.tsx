import { Dispatch, SetStateAction, useState } from "react";

import { Button, Col, Form } from "react-bootstrap";
import { tasks } from "../utils/data";

interface FormSelection {
  selectedTasks: string[];
  setSelectedTask: Dispatch<SetStateAction<string[]>>;
}
const PERTAnalysis = ({ selectedTasks, setSelectedTask }: FormSelection) => {
  const [taskValue, setTaskValue] = useState(0.0);
  //Render Switch inputs dynamically
  const handleSelectedTasks = (newTask: string) => {
    setSelectedTask((prev) => {
      if (prev.includes(newTask)) {
        return prev.filter((task) => task !== newTask);
      } else {
        return [...prev, newTask];
      }
    });
  };

  return (
    <Col className="my-4 p-4">
      <h2 className="h5 mx-2 fw-normal">Select tasks for PERT Analysis</h2>

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
            <strong>Styling Task - 120.0 minutes</strong>
          </em>
        </Col>
        <div className="d-flex flex-wrap gap-2">
          {selectedTasks.map((taskName, index) => (
            <Form.Group key={index} className="mb-2 col-lg-2 col-sm-8 col-md-8">
              <Form.Label className="fw-light text-capitalize">
                {taskName}
              </Form.Label>
              <Form.Control
                type="number"
                value={taskValue}
                onChange={(e) => setTaskValue(parseFloat(e.target.value))}
              />
            </Form.Group>
          ))}
        </div>
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
