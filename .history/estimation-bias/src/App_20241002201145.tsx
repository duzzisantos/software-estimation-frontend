import "./App.css";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";

function App() {
  return (
    <Container fluid className="flex-grow-0 flex-shrink-1 bg-black col-12">
      <Row>
        <Col sm={10} md={10} lg={12} xxl={12} xs={10}>
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
    </Container>
  );
}

export default App;
