import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TaskProps {
  taskName: string;
  taskValue: number;
  setTaskValue: (newValue: number) => void;
}

export const TaskInput = ({ taskName, taskValue, setTaskValue }: TaskProps) => {
  return (
    <div className="space-y-1.5">
      <Label className="capitalize text-xs">{taskName}</Label>
      <Input
        type="number"
        value={taskValue}
        onChange={(e) => setTaskValue(parseFloat(e.target.value))}
        min={0}
      />
    </div>
  );
};
