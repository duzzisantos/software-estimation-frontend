import { useState } from "react";
import { Form } from "react-bootstrap";

interface TaskProps {
  taskName: string;
}

export const TaskInput = ({ taskName }: TaskProps) => {
  const [taskValue, setTaskValue] = useState(0.0);

  console.log({ taskName, taskValue });
  return (
    <Form.Group className="mb-2 col-lg-2 col-sm-8 col-md-8">
      <Form.Label className="fw-light text-capitalize">{taskName}</Form.Label>
      <Form.Control
        type="number"
        value={taskValue}
        onChange={(e) => setTaskValue(parseFloat(e.target.value))}
      />
    </Form.Group>
  );
};
