import { db } from "@lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'tasks'));
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newTaskRef = await addDoc(collection(db, 'tasks'), {
      title: body.title,
      description: body.description || "",
      completed: false,
      priority: body.priority || "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      id: newTaskRef.id,
      title: body.title,
      description: body.description || "",
      completed: false,
      priority: body.priority || "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
