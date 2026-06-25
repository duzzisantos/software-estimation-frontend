export interface Task {
  taskName: string;
  timeEstimate: number;
}

export function formatTaskName(name: string): string {
  return name.split("_").join(" ");
}
