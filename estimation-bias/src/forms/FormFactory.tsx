import { Form } from "react-bootstrap";

interface TaskProps {
  taskName: string;
  taskValue: number;
  setTaskValue: (newValue: number) => void;
}

export const TaskInput = ({ taskName, taskValue, setTaskValue }: TaskProps) => {
  return (
    <Form.Group className="mb-2 col-lg-2 col-sm-8 col-md-8">
      <Form.Label className="fw-light text-capitalize">{taskName}</Form.Label>
      <Form.Control
        type="number"
        value={taskValue}
        onChange={(e) => setTaskValue(parseFloat(e.target.value))}
        min={0}
      />
    </Form.Group>
  );
};
