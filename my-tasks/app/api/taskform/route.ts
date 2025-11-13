import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";

export async function GET() {
  const snapshot = await getDocs(collection(db, "tasks"));
  const tasks = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.userEmail) {
      return NextResponse.json({ error: "userEmail is required" }, { status: 400 });
    }

    const taskRef = await addDoc(collection(db, "tasks"), {
      title: body.title,
      description: body.description ?? "",
      priority: body.priority ?? "Medium",
      completed: body.completed ?? false,
      userEmail: body.userEmail,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      id: taskRef.id,
      title: body.title,
      description: body.description ?? "",
      priority: body.priority ?? "Medium",
      completed: body.completed ?? false,
      userEmail: body.userEmail,
    });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}