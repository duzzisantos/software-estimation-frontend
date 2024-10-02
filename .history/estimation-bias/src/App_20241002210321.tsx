import { useState } from "react";
import "./App.css";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import PERTAnalysis from "./layout/PERT";

function App() {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [taskValue, setTaskValue] = useState(0);
  return (
    <Container fluid className="flex-grow-0 flex-shrink-1 text-dark vh-100 App">
      <h1 className="my-4 fw-bold text-primary">Software Estimation Bias</h1>
      <Row>
        <Col>
          <Tabs defaultActiveKey={"pert"}>
            <Tab eventKey={"pert"} title="PERT" className="fw-bold">
              <PERTAnalysis
                selectedTasks={selectedTasks}
                setSelectedTask={setSelectedTasks}
                taskValue={taskValue}
                setTaskValue={setTaskValue}
              />
            </Tab>
            <Tab
              eventKey={"time-series"}
              title="Time Series"
              className="fw-bold"
            >
              LEEMAOO
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
