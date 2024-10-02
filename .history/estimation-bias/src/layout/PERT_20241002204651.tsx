import { TaskInput } from "../forms/FormFactory";
import { Button, Col, Form } from "react-bootstrap";
import { tasks } from "../utils/data";

const PERTAnalysis = () => {
  return (
    <Col>
      <h2>Enter tasks for PERT Analysis</h2>
      <hr />

      <div>
        {tasks.map((task) => (
          <Form.Check key={task} />
        ))}
      </div>

      <Form></Form>
    </Col>
  );
};

export default PERTAnalysis;
