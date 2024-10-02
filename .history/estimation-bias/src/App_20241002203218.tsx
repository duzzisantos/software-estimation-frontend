import "./App.css";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";

function App() {
  return (
    <Container fluid className="bg-light h-100 vh-100 App">
      <Row>
        <Col>
          <Tabs defaultActiveKey={"pert"}>
            <Tab eventKey={"pert"} title="PERT">
              LOL
            </Tab>
            <Tab eventKey={"time-series"} title="Time Series">
              LEEMAOO
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
