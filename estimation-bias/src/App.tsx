import { useState } from "react";
import "./App.css";
import { Container, Row, Col, Tab, Tabs, Stack, Button } from "react-bootstrap";
import PERTAnalysis from "./layout/PERT";
import TimeSeriesAnalysis from "./layout/TimeSeries";

import logo2 from "./assets/SPE 2.jpeg";
import { Fonts } from "react-bootstrap-icons";

interface Task {
  taskName: string;
  timeEstimate: number;
}
function App() {
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [selectedNewTasks, setSelectedNewsTasks] = useState<Task[]>([]);
  const [fontSize, setFontSize] = useState({
    small: false,
    medium: false,
    large: false,
  });

  return (
    <Container
      fluid
      className={`flex-grow-0 flex-shrink-1 text-dark vh-100 App ${
        fontSize.large
          ? "fs-2"
          : fontSize.medium
          ? "fs-4"
          : fontSize.small
          ? "fs-6"
          : "fs-6"
      }`}
    >
      <Row>
        <Col>
          <div className="h6 text-secondary fw-bold border-bottom border-2  d-flex justify-content-between hstack">
            {" "}
            <div className="mt-2">
              <img
                height={60}
                width={100}
                src={logo2}
                alt="Software Project Estimator"
              />{" "}
              Software Project Estimator
            </div>
            <Stack direction="horizontal" gap={1}>
              <Button
                size="sm"
                variant="transparent"
                className="border"
                onClick={() =>
                  setFontSize({
                    ...fontSize,
                    small: true,
                    medium: false,
                    large: false,
                  })
                }
              >
                <Fonts className="fs-6" focusable={false} />
              </Button>
              <Button
                size="sm"
                variant="transparent"
                className="border"
                onClick={() =>
                  setFontSize({
                    ...fontSize,
                    medium: true,
                    large: false,
                    small: false,
                  })
                }
              >
                <Fonts className="fs-4" focusable={false} />
              </Button>
              <Button size="sm" variant="transparent" className="border">
                <Fonts
                  className="fs-2"
                  focusable={false}
                  onClick={() =>
                    setFontSize({
                      ...fontSize,
                      large: true,
                      medium: false,
                      small: false,
                    })
                  }
                />
              </Button>
            </Stack>
          </div>
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
