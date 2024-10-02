import "./App.css";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";

function App() {
  return (
    <Row>
      <Col>
        <Tabs defaultActiveKey={"pert"}>
          <Tab key={"pert"} title="PERT">
            LOL
          </Tab>
          <Tab key={"time-series"} title="Time Series">
            LEEMAOO
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
}

export default App;
