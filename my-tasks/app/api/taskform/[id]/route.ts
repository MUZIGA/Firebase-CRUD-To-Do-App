import { db } from "@lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const body = await req.json();
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, {
      ...body,
      updatedAt: new Date(),
    });
    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error("PUT /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: "task ID is required" }, { status: 400 });
    }
    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);
    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}