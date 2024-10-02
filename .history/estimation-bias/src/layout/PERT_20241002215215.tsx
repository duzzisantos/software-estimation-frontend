import { Dispatch, SetStateAction } from "react";
import { TaskInput } from "../forms/FormFactory";
import { Button, Col, Form } from "react-bootstrap";
import { tasks } from "../utils/data";

interface FormSelection {
  selectedTasks: string[];
  setSelectedTask: Dispatch<SetStateAction<string[]>>;
  taskValue: number;
  setTaskValue: Dispatch<SetStateAction<number>>;
}
const PERTAnalysis = ({
  selectedTasks,
  setSelectedTask,
  taskValue,
  setTaskValue,
}: FormSelection) => {
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
          {selectedTasks.map((element, index) => (
            <TaskInput
              key={index}
              taskName={element.split("_").join(" ")}
              value={taskValue}
              setValue={setTaskValue}
            />
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
