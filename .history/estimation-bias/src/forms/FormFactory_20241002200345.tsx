import { Dispatch, SetStateAction } from "react";
import { Form } from "react-bootstrap";

interface TaskProps {
  taskName: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}

const TaskInput = ({ taskName, value, setValue }: TaskProps) => {
  return (
    <Form.Group className="mb-2">
      <Form.Label>{taskName}</Form.Label>
      <Form.Control
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
      />
    </Form.Group>
  );
};

export default TaskInput;
