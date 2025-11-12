"use client";

import { Task } from "@/app/types";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
  onToggleCompleted: (taskId: string, isCompleted: boolean) => Promise<void>;
}

export default function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggleCompleted,
}: TaskItemProps) {
  const handleToggle = () => {
    void onToggleCompleted(task.id, task.completed);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      void onDelete(task.id);
    }
  };

  return (
    <article
      className={`rounded-lg border border-gray-200 p-4 shadow-sm transition ${
        task.completed ? "bg-gray-100" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <h3 className={`text-base font-semibold text-gray-900 ${task.completed ? "line-through" : ""}`}>
              {task.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600">{task.description}</p>
            <span
              className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                task.priority === "High"
                  ? "bg-red-100 text-red-700"
                  : task.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {task.priority} priority
            </span>
          </div>
        </label>
        <div className="flex flex-col gap-2 text-sm font-medium text-indigo-600">
          <button onClick={() => onEdit(task)} className="hover:underline">
            Edit
          </button>
          <button onClick={handleDelete} className="text-red-600 hover:underline">
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}