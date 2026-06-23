import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Results } from "../utils/usePertAnalysis";

interface Props {
  result: Results | undefined;
}

const MonteCarloTable = ({ result }: Props) => {
  if (!result) return null;

  const headers: string[] = [];
  const values: string[] = [];

  Object.entries(result).forEach(([key]) => {
    if (
      key.includes("most_likely") ||
      key.includes("optimistic") ||
      key.includes("pessimistic")
    ) {
      headers.push(key.split("_").join(" "));
      values.push(String(result[key as keyof Results]));
    } else if (key === "predictions") {
      Object.entries(result.predictions).forEach(([pKey, pVal]) => {
        headers.push(pKey.split("_").join(" "));
        values.push(String(pVal));
      });
    }
  });

  return (
    <div className="mt-4 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((h) => (
              <TableHead key={h} className="capitalize">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {values.map((v, i) => (
              <TableCell key={i} className="font-mono text-sm">
                {v}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default MonteCarloTable;
