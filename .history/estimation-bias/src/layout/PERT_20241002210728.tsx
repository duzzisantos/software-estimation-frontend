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
    <Col>
      <h2>Enter tasks for PERT Analysis</h2>
      <hr />

      <div className="d-flex flex-fill hstack gap-2 flex-md-wrap flex-sm-wrap">
        {tasks.map((task) => (
          <Form.Group key={task}>
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

      <Form>
        {selectedTasks.map((element, index) => (
          <TaskInput
            key={index}
            taskName={element.split("_").join(" ").toUpperCase()}
            value={taskValue}
            setValue={setTaskValue}
          />
        ))}
        <Button>Submit Tasks</Button>
      </Form>
    </Col>
  );
};

export default PERTAnalysis;
