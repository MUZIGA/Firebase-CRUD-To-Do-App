export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } =  await context.params;
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

export async function DELETE (req: Request,content: {params:any}){
  try {
    const {id} =await content.params;
    if (!id ){
      return NextResponse.json ({error:"task ID is required"} ,{status:400})

    }
    const TaskRef =doc(db ,"task",id);
  await deleteDoc(TaskRef)
  return NextResponse.json({message:"Task delete"});
  
  }
  catch (error) {
    console.error("PUT /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    )
  }
  

}