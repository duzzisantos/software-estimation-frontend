import { useState } from "react";
import "./App.css";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";
import PERTAnalysis from "./layout/PERT";
import TimeSeriesAnalysis from "./layout/TimeSeries";
import logo2 from "./assets/SPE 2.jpeg";

interface Task {
  taskName: string;
  timeEstimate: number;
}
function App() {
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [selectedNewTasks, setSelectedNewsTasks] = useState<Task[]>([]);

  return (
    <Container fluid className="flex-grow-0 flex-shrink-1 text-dark vh-100 App">
      <header className="page-header shadow-lg">
        <img
          height={90}
          width={140}
          src={logo2}
          alt="Software Project Estimator"
        />{" "}
      </header>
      <Row className="mt-5">
        <Col>
          <h1 className="h5 fw-bold mx-3">Software Project Estimator</h1>
          <Tabs defaultActiveKey={"pert"} variant="underline" className="p-3">
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
