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
            {result !== undefined
              ? Object.entries(result)?.map(([key]) =>
                  key.includes("most_likely") ||
                  key.includes("optimistic") ||
                  key.includes("pessimistic") ? (
                    <th className="text-capitalize" key={key}>
                      {key.split("_").join(" ")}
                    </th>
                  ) : key.includes("predictions") ? (
                    Object.values(key)?.map((element) =>
                      Object.entries(element)?.map(([i, j]) => (
                        <th key={`${i}-${j}`}>{i}</th>
                      ))
                    )
                  ) : null
                )
              : null}
          </tr>
        </thead>
        <tbody>
          <tr>
            {result !== undefined
              ? Object.entries(result)?.map(([key, value]) =>
                  key.includes("most_likely") ||
                  key.includes("optimistic") ||
                  key.includes("pessimistic") ? (
                    <td className="text-capitalize" key={`${key}-${value}`}>
                      {value}
                    </td>
                  ) : key.includes("predictions") ? (
                    Object.values(key)?.map((element) =>
                      Object.entries(element)?.map(([i, j]) => (
                        <td key={`${i}-${j}`}>{i}</td>
                      ))
                    )
                  ) : null
                )
              : null}
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default MonteCarloTable;