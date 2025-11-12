"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import { Task } from "./types";
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // ---------- AUTH ----------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else router.push("/login");
      setLoading(false);
    });
    return unsub;
  }, [router]);
  // ---------- REAL-TIME TASKS ----------
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "taskform"),
      where("userEmail", "==", user.email)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as Task)
        );
        setTasks(data);
      },
      (err) => console.error("Snapshot error:", err)
    );
    return unsub;
  }, [user]);
  // ---------- ADD / UPDATE (called from TaskForm) ----------
  const handleSave = async (task: Partial<Task>) => {
    if (!user) return;
    try {
      if (editTask) {
        // UPDATE
        const ref = doc(db, "taskform", editTask.id);
        await updateDoc(ref, task);
      } else {
        // CREATE
        await addDoc(collection(db, "taskform"), {
          ...task,
          completed: false,
          userEmail: user.email,
        });
      }
      setEditTask(null); // clear form
    } catch (e) {
      console.error(e);
    }
  };
  // ---------- DELETE ----------
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "taskform", id));
  };
  // ---------- TOGGLE COMPLETE ----------
  const toggleComplete = async (id: string, completed: boolean) => {
    await updateDoc(doc(db, "taskform", id), { completed: !completed });
  };
  if (loading) return <p className="text-center mt-10">Loading…</p>;
  if (!user) return null;
  return (
    <div className="min-h-screen bg-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">
            Hello, {user.email}
          </h1>
          <button
            onClick={() => auth.signOut().then(() => router.push("/login"))}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        {/* Form */}
        <TaskForm
          editTask={editTask}
          onSave={handleSave}
          clearEdit={() => setEditTask(null)}
        />
        {/* Task List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Your Tasks
          </h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 italic">
              No tasks yet. Add one above!
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onEdit={setEditTask}
                  onDelete = {handleDelete}
                  onToggle={toggleComplete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
</div>
);
}