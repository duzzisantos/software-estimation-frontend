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
  const handleSelectedTasks = (newTask: string) => {
    setSelectedTask((prev) => [...prev, newTask]);
  };

  return (
    <Col className="my-4 p-4">
      <h2 className="h4 mx-2 fw-bold">Enter tasks for PERT Analysis</h2>

      <div className="d-flex flex-fill hstack gap-2 flex-md-wrap flex-sm-wrap p-2">
        {tasks.map((task) => (
          <Form.Group
            key={task}
            className="bg-primary-subtle text-dark rounded-3 hstack gap-2 p-2"
          >
            <Form.Label className="text-capitalize">
              {task.split("_").join(" ")}
            </Form.Label>
            <Form.Check
              value={task}
              onChange={() => handleSelectedTasks(task)}
            />
          </Form.Group>
        ))}
      </div>

      <Form className="d-flex flex-column gap-3 bg-light-subtle my-3 p-2">
        <Col className="py-3 bg-light fw-light border-right">
          Note: For every selected task, you are to provide an estimated time in
          decimal format. Example: Styling Task - 120.0 minutes
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
        <div className="mw-100">
          <Button size="sm">Submit Tasks</Button>
        </div>
      </Form>
    </Col>
  );
};

export default PERTAnalysis;
