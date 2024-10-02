import { Dispatch, SetStateAction } from "react";
import { Form } from "react-bootstrap";

interface TaskProps {
  taskName: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
}

export const TaskInput = ({ taskName, value, setValue }: TaskProps) => {
  return (
    <Form.Group className="mb-2 col-lg-2 col-sm-8 col-md-8">
      <Form.Label className="fw-light">{taskName}</Form.Label>
      <Form.Control
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
      />
    </Form.Group>
  );
};
