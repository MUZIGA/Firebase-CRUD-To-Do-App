"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuth } from "@context/AuthContext";
import { auth, db } from "@lib/firebase";
import TaskForm from "./components/Taskform";
import TaskItem from "./components/TaskItem";
import { Task } from "./types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const tasksQuery = query(collection(db, "tasks"), where("userEmail", "==", user.email));

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const nextTasks: Task[] = snapshot.docs.map((document) => {
          const data = document.data();
          return {
            id: document.id,
            title: data.title,
            description: data.description,
            priority: data.priority,
            completed: data.completed,
            userEmail: data.userEmail,
            createdAt: typeof data.createdAt?.toMillis === "function" ? data.createdAt.toMillis() : undefined,
            updatedAt: typeof data.updatedAt?.toMillis === "function" ? data.updatedAt.toMillis() : undefined,
          };
        });
        nextTasks.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        setTasks(nextTasks);
      },
      (snapshotError) => {
        console.error("Failed to subscribe to tasks:", snapshotError);
        setError("Could not load your tasks. Please refresh.");
      }
    );

    return unsubscribe;
  }, [user]);

  const handleSaveTask = async (taskInput: Pick<Task, "title" | "description" | "priority">) => {
    if (!user) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (selectedTask) {
        await updateDoc(doc(db, "tasks", selectedTask.id), {
          ...taskInput,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "tasks"), {
          ...taskInput,
          completed: false,
          userEmail: user.email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setSelectedTask(null);
    } catch (saveError) {
      console.error("Failed to save task:", saveError);
      setError("Unable to save the task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
    } catch (deleteError) {
      console.error("Failed to delete task:", deleteError);
      setError("Unable to delete the task. Please try again.");
    }
  };

  const handleToggleCompleted = async (taskId: string, isCompleted: boolean) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        completed: !isCompleted,
        updatedAt: serverTimestamp(),
      });
    } catch (toggleError) {
      console.error("Failed to update task status:", toggleError);
      setError("Unable to update the task status. Please try again.");
    }
  };

  const pendingTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (logoutError) {
      console.error("Failed to sign out:", logoutError);
      setError("Unable to log out right now. Please try again.");
    }
  };

  if (loading || (!user && loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-6 shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Hello, {user?.email}</h1>
            <p className="text-sm text-gray-600">Stay on top of your tasks by tracking them here.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        <TaskForm
          key={selectedTask?.id ?? "new-task"}
          editTask={selectedTask}
          onSave={handleSaveTask}
          onCancelEdit={() => setSelectedTask(null)}
          isSubmitting={isSubmitting}
        />

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow">
            <h2 className="text-lg font-semibold text-gray-800">Pending Tasks</h2>
            <p className="text-sm text-gray-500">Tasks that still need your attention.</p>
            <div className="mt-4 space-y-3">
              {pendingTasks.length === 0 ? (
                <p className="text-sm text-gray-500">Nothing pending right now.</p>
              ) : (
                pendingTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={setSelectedTask}
                    onDelete={handleDeleteTask}
                    onToggleCompleted={handleToggleCompleted}
                  />
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <h2 className="text-lg font-semibold text-gray-800">Completed Tasks</h2>
            <p className="text-sm text-gray-500">Great job! You can always undo completion.</p>
            <div className="mt-4 space-y-3">
              {completedTasks.length === 0 ? (
                <p className="text-sm text-gray-500">No completed tasks yet.</p>
              ) : (
                completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={setSelectedTask}
                    onDelete={handleDeleteTask}
                    onToggleCompleted={handleToggleCompleted}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
