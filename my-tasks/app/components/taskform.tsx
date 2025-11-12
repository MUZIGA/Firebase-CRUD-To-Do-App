// src/app/dashboard/components/TaskForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { Task } from "@/app/types";

interface TaskFormProps {
  editTask: Task | null;
  onSave: (data: Pick<Task, "title" | "description" | "priority">) => Promise<void>;
  onCancelEdit: () => void;
  isSubmitting: boolean;
}

export default function TaskForm({ editTask, onSave, onCancelEdit, isSubmitting }: TaskFormProps) {
  const [title, setTitle] = useState(() => editTask?.title ?? "");
  const [description, setDescription] = useState(() => editTask?.description ?? "");
  const [priority, setPriority] = useState<Task["priority"]>(() => editTask?.priority ?? "Medium");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave({ title, description, priority });
    if (!editTask) {
      setTitle("");
      setDescription("");
      setPriority("Medium");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {editTask ? "Update Task" : "Create Task"}
        </h2>
        {editTask && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm font-medium text-indigo-600 hover:underline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="w-full rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        required
        disabled={isSubmitting}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        className="w-full rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        rows={4}
        required
        disabled={isSubmitting}
      />
      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value as Task["priority"])}
        className="w-full rounded-md border border-gray-300 p-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        disabled={isSubmitting}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : editTask ? "Save Changes" : "Add Task"}
      </button>
    </form>
  );
}
