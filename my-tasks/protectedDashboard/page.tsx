"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Task } from "@/type";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
      else setUserEmail(user.email!);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    const q = query(collection(db, "tasks"), where("userEmail", "==", userEmail));
    const unsubscribeTasks = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, "id">),
      }));
      setTasks(tasksData);
    });
    return () => unsubscribeTasks();
  }, [userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateDoc(doc(db, "tasks", editingId), {
        title,
        description,
        priority,
      });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        priority,
        completed: false,
        userEmail,
      });
    }
    setTitle("");
    setDescription("");
    setPriority("Low");
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setEditingId(task.id);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const toggleComplete = async (task: Task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      completed: !task.completed,
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div>
      <h1>Hello, {userEmail}</h1>
      <button onClick={handleLogout}>Logout</button>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit">{editingId ? "Update Task" : "Add Task"}</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Priority: {task.priority}</p>
            <label>
              Completed:
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
              />
            </label>
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
