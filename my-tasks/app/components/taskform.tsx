// src/app/dashboard/components/TaskForm.tsx
"use client";
import { useState, useEffect } from "react";
import { Task } from "@/app/types";
interface TaskFormProps {
  editTask?: Task | null;
  onSave: (data: Partial<Task>) => Promise<void>;
  clearEdit: () => void;
}
export default function TaskForm({
  editTask,
  onSave,
  clearEdit,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  // Sync form when editTask changes
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setPriority(editTask.priority);
    } else {
      setTitle("");
      setDescription("");
      setPriority("Medium");
    }
  }, [editTask]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ title, description, priority });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md mb-6"
    >
      <h2 className="text-xl font-semibold mb-4">
        {editTask ? "Edit Task" : "Add New Task"}
      </h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border mb-3 rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border mb-3 rounded"
        rows={3}
        required
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Task["priority"])}
        className="w-full p-2 border mb-3 rounded"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editTask ? "Update" : "Add"} Task
        </button>
        {editTask && (
          <button
            type="button"
            onClick={clearEdit}
            className="bg-black text-pink-500 px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}