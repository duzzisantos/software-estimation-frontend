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
                Object.entries(value).map(([anotherKey, value]) =>
                  Object.entries(value).map(([i, j]) => (
                    <th key={`${i}-${j}`}>{anotherKey}</th>
                  ))
                )
              ) : null
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.entries(result).map(([key, value]) =>
              key.includes("most_likely") ||
              key.includes("optimistic") ||
              key.includes("pessimistic") ? (
                <td className="text-capitalize" key={`${key}-${value}`}>
                  {value}
                </td>
              ) : key.includes("predictions") ? (
                Object.values(key).map(([anotherKey, anotherValue]) => (
                  <th key={`${anotherKey}-${anotherValue}`}>{anotherValue}</th>
                ))
              ) : null
            )}
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default MonteCarloTable;
