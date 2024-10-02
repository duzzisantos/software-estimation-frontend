import { useState } from "react";
import "./App.css";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import PERTAnalysis from "./layout/PERT";
import TimeSeriesAnalysis from "./layout/TimeSeries";

interface Task {
  taskName: string;
  timeEstimate: number;
}
function App() {
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [selectedNewTasks, setSelectedNewsTasks] = useState<Task[]>([]);

  return (
    <Container fluid className="flex-grow-0 flex-shrink-1 text-dark vh-100 App">
      <h1 className="my-4 h2 fw-normal">Software Project Estimation</h1>
      <Row>
        <Col>
          <Tabs defaultActiveKey={"pert"}>
            <Tab eventKey={"pert"} title="PERT" className="fw-bold">
              <PERTAnalysis
                selectedTasks={selectedTasks}
                setSelectedTasks={setSelectedTasks}
              />
            </Tab>
            <Tab
              eventKey={"time-series"}
              title="Time Series"
              className="fw-bold"
            >
              <TimeSeriesAnalysis
                setSelectedNewTasks={setSelectedNewsTasks}
                selectedNewTasks={selectedNewTasks}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
