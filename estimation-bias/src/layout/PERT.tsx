import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Data } from "../graphs/MonteCarloSimulation";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import { TaskInput } from "../forms/FormFactory";
import {
  Alert,
  Badge,
  Button,
  Col,
  Form,
  Tab,
  Tabs,
  Spinner,
} from "react-bootstrap";
import { tasks } from "../utils/data";
import fetchPertData from "../utils/fetchPertData";
import MonteCarloTable from "../tables/MonteCarloTable";

enum APIResponse {
  OK = 200,
  Created = 201,
  NotFound = 404,
  ServerError = 500,
  UnAuthorized = 401,
}

// Define a strict Task type
interface Task {
  taskName: string;
  timeEstimate: number;
}

interface FormSelection {
  selectedTasks: Task[];
  setSelectedTasks: Dispatch<SetStateAction<Task[]>>;
}

export interface Results {
  simulated_operations: number[];
  predictions: {
    mean_duration: number;
    st_deviation: number;
    ninetieth_percentile: number;
  };
  pessimistic_estimation: number;
  most_likely_estimation: number;
  optimistic_estimation: number;
}

const PERTAnalysis = ({ selectedTasks, setSelectedTasks }: FormSelection) => {
  const [optimistic, setOptimistic] = useState(0.0);
  const [pessimistic, setPessimistic] = useState(0.0);
  const [results, setResults] = useState<Results>();
  const [apiResponse, setApiResponse] = useState<number>(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [data, setData] = useState<Data[]>();
  const [options, setOptions] = useState<AgChartOptions>({
    data,
    title: { text: "PERT Analysis using Monte Carlo Simulations" },
    series: [{ type: "bar", xKey: "Simulation", yKey: "Score" }],
  });

  useEffect(() => {
    const generateDataSet = () => {
      const output: Data[] = [];
      if (results?.simulated_operations === undefined) {
        return output;
      } else if (results?.simulated_operations !== undefined) {
        for (let i = 0; i < results?.simulated_operations.length; i++) {
          output.push({
            Simulation: i + 1,
            Score: results?.simulated_operations[i],
          });
        }
        return output;
      }
      // return output;
    };
    // Once data is generated, update the options

    setData(generateDataSet());

    // Update the chart options when data is ready
    setOptions((prevOptions) => ({
      ...prevOptions,
      data: data, // Set the updated data
    }));

    //eslint-disable-next-line
  }, [results]);

  // Handle task selection, adding/removing task objects
  const handleSelectedTasks = (newTaskName: string) => {
    setSelectedTasks((prevTasks) => {
      const taskExists = prevTasks.find(
        (task) => task.taskName === newTaskName
      );

      if (taskExists) {
        // Remove the task if it exists
        return prevTasks.filter((task) => task.taskName !== newTaskName);
      } else {
        // Add a new task with a default time estimate
        return [...prevTasks, { taskName: newTaskName, timeEstimate: 0.0 }];
      }
    });
  };

  // Update the time estimate of a task
  const updateTaskTime = (taskName: string, newTimeEstimate: number) => {
    setSelectedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskName === taskName
          ? { ...task, timeEstimate: newTimeEstimate }
          : task
      )
    );
  };

  const totalMostLikelyTime = selectedTasks
    .map((element: Task) => element.timeEstimate)
    .reduce((acc, curr) => curr + acc, 0);

  //Prepare API request body in post object containing required fields that will run the Monte Carlo Simulation
  const postObject = {
    optimistic,
    most_likely: totalMostLikelyTime,
    pessimistic,
  };

  const handleQueryPertAnalysis = async () => {
    setHasSubmitted(true);
    try {
      const res = await fetchPertData(postObject);

      setApiResponse(res?.status);
      setResults(res);
    } catch (err) {
      return console.log(err);
    }
  };

  return (
    <Col className="my-4 p-3">
      <h2 className="h5 fw-normal">
        Select tasks for PERT Analysis run by Monte Carlo Simulation
      </h2>

      <div className="d-flex flex-fill form-generate hstack gap-2 rounded-3 shadow-lg flex-md-wrap flex-sm-wrap p-3 py-5">
        {tasks.map((task) => (
          <Form.Group
            key={task}
            className=" bg-primary-subtle text-dark fw-light rounded-3 hstack gap-2 p-2"
          >
            <Form.Label className="text-capitalize">
              {task.split("_").join(" ")}
            </Form.Label>
            <Form.Check
              type="switch"
              value={task}
              onChange={() => handleSelectedTasks(task)}
            />
          </Form.Group>
        ))}
      </div>

      <Form className="d-flex flex-column gap-3 bg-light-subtle my-5 p-3 rounded-2 py-5 shadow-lg">
        <h2 className="fw-normal h5">Provide Estimates</h2>
        <Col
          lg={6}
          className="py-3 px-2 bg-light fw-light border-start border-5 border-primary"
        >
          Note: For every selected task, you are to provide an estimated time .
          Example:{" "}
          <em>
            <strong>Styling Task - 120 minutes.</strong>
          </em>{" "}
          Pessimistic time must be greater than optimistic and most likely time.
          The goal is to gather data for optimistic, most likely (which is a sum
          of all the estimates you will provide per selected task), and finally
          the pessimistic estimates.
        </Col>
        <div className="d-flex flex-wrap gap-2">
          {selectedTasks.map((task, index) => (
            <TaskInput
              key={index}
              taskName={task.taskName.split("_").join(" ")}
              taskValue={task.timeEstimate}
              setTaskValue={(newValue: number) =>
                updateTaskTime(task.taskName, newValue)
              }
            />
          ))}
        </div>
        {selectedTasks.length > 0 && (
          <Col className="bg-light-subtle py-3 d-flex flex-column gap-3 fw-normal border-top border-dark-subtle border-2 my-3">
            <div className="hstack gap-5">
              <Form.Group>
                <Form.Label>
                  Optimistic Time{" "}
                  <small className="text-danger">* required</small>
                </Form.Label>
                <Form.Control
                  required
                  type="number"
                  min={0}
                  placeholder="Enter optmistic time"
                  value={optimistic}
                  onChange={(e) => setOptimistic(parseFloat(e.target.value))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Pessimistic Time{" "}
                  <small className="text-danger">* required</small>
                </Form.Label>
                <Form.Control
                  required
                  type="number"
                  min={0}
                  placeholder="Enter pessimistic time"
                  value={pessimistic}
                  onChange={(e) => setPessimistic(parseFloat(e.target.value))}
                />
              </Form.Group>
            </div>
            <div className="hstack gap-5">
              <output>
                Optimistic Estimation:{" "}
                <Badge bg="success" pill>
                  {optimistic}
                </Badge>
              </output>
              <output>
                Most Likely Estimation:{" "}
                <Badge bg="info" className="text-dark" pill>
                  {totalMostLikelyTime}
                </Badge>
              </output>
              <output>
                Pessimistic Estimation:{" "}
                <Badge bg="danger" pill>
                  {pessimistic}
                </Badge>
              </output>
            </div>
          </Col>
        )}
        {selectedTasks.length > 0 ? (
          <div className="mw-100 gap-2 hstack ">
            {/* <Button variant="secondary" size="sm" onClick={handleClearAllForms}>
              Clear all forms
            </Button> */}
            <Button
              onClick={handleQueryPertAnalysis}
              className={`${
                hasSubmitted && apiResponse === APIResponse.OK
                  ? "bg-success"
                  : ""
              }`}
            >
              {hasSubmitted ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Processing...</span>
                </Spinner>
              ) : hasSubmitted && apiResponse === 0 ? (
                ""
              ) : null}{" "}
              Submit Estimates
            </Button>
          </div>
        ) : null}
      </Form>

      <Col className="my-5 shadow-lg rounded-3 p-3">
        <h2 className="h5 fw-normal">Estimation Analysis Result</h2>
        <Tabs defaultActiveKey={"table"} variant="underline">
          <Tab eventKey={"chart"} title="Result Chart">
            {" "}
            <AgCharts options={options} style={{ height: "650px" }} />
          </Tab>
          <Tab eventKey={"table"} title="Result Table">
            {results !== undefined ? (
              <MonteCarloTable result={results} />
            ) : (
              <Alert variant="info" className="border-0 mt-3 fw-normal">
                No results to show yet
              </Alert>
            )}
          </Tab>
        </Tabs>
      </Col>
    </Col>
  );
};

export default PERTAnalysis;
