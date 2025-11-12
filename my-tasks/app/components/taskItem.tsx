"use client";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Task } from "../types";
interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onUpdate: () => void;
}
export default function TaskItem({ task, onEdit, onUpdate }: TaskItemProps) {
  const toggleComplete = async () => {
    const taskRef = doc(db, "tasks", task.id);
    await updateDoc(taskRef, { completed: !task.completed });
    onUpdate();
  };
  const handleDelete = async () => {
    if (confirm("Delete this task?")) {
      await deleteDoc(doc(db, "tasks", task.id));
      onUpdate();
    }
  };
  return (
    <div className={`p-4 border rounded mb-3 ${task.completed ? "bg-gray-100" : "bg-black"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={toggleComplete}
            className="w-5 h-5"
          />
          <div>
            <h3 className={`font-semibold ${task.completed ? "line-through" : ""}`}>
              {task.title}
            </h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <span
              className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                task.priority === "High"
                  ? "bg-red-200 text-red-800"
                  : task.priority === "Medium"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {task.priority}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className= " bg-yellow-600 text-pink-600 hover:underline text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className=" bg-amber-800 text-red-600 hover:underline text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}