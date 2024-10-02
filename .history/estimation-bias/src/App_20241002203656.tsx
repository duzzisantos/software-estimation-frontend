import "./App.css";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";

function App() {
  return (
    <Container fluid className="flex-grow-0 flex-shrink-1 text-dark vh-100 App">
      <h1 className="my-4 fw-bold text-primary">Software Estimation Bias</h1>
      <Row>
        <Col>
          <Tabs defaultActiveKey={"pert"}>
            <Tab eventKey={"pert"} title="PERT" className="fw-bold">
              LOL
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
