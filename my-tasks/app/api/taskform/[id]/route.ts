import { NextRequest, NextResponse } from "next/server";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// -------------------------
// PUT (Update a Task)
// -------------------------
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // <-- Use Promise
) {
  try {
    const { id } = await context.params; // <-- Await because it's a promise
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();

    const taskRef = doc(db, "tasks", id);

    await updateDoc(taskRef, {
      ...body,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ id, ...body }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/taskform/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update task", details: String(error) },
      { status: 500 }
    );
  }
}

// -------------------------
// DELETE (Remove a Task)
// -------------------------
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // <-- Use Promise
) {
  try {
    const { id } = await context.params; // <-- Await here too
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/taskform/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete task", details: String(error) },
      { status: 500 }
    );
  }
}
