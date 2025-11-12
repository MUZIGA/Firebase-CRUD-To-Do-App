// types/index.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  userEmail: string;
  createdAt?: number;
  updatedAt?: number;
}
