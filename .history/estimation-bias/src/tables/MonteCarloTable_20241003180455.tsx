import { Table } from "react-bootstrap";
import { Results } from "../layout/PERT";

interface Props {
  result: Results;
}
const MonteCarloTable = ({ result }: Props) => {
  return (
    <div>
      <Table>
        <thead>
          <tr>
            {Object.entries(result).map(([key]) =>
              key.includes("most_likely") ||
              key.includes("optimistic") ||
              key.includes("pessimistic") ? (
                <th className="text-capitalize" key={key}>
                  {key.split("_").join(" ")}
                </th>
              ) : key.includes("predictions") ? (
                Object.values(key).map(([anotherKey]) => (
                  <th key={anotherKey}>{anotherKey}</th>
                ))
              ) : null
            )}
          </tr>
        </thead>
      </Table>
    </div>
  );
};

export default MonteCarloTable;