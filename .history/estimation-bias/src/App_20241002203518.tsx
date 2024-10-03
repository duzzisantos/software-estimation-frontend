import "./App.css";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";

function App() {
  return (
    <Container fluid className="bg-light vh-100 App">
      <h1 className="my-4 text-primary">Software Estimation Bias</h1>
      <Row>
        <Col>
          <Tabs defaultActiveKey={"pert"}>
            <Tab eventKey={"pert"} title="PERT" className="fw-bolder">
              LOL
            </Tab>
            <Tab
              eventKey={"time-series"}
              title="Time Series"
              className="fw-bolder"
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