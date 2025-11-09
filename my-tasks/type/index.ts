export interface Task {
  id: string;                       // Firestore document ID
  title: string;                    // Task title
  description: string;              // Task description/details
  completed: boolean;               // Task completion status
  priority: "Low" | "Medium" | "High"; // Priority of the task
  userEmail: string;                // Email of the logged-in user
}
