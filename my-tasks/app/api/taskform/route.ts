import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";
export async function  GET(){
   const snapshot = await getDocs (collection (db,"taskform")) ;
   const taskform=snapshot.docs.map(doc=>({id:doc.id, ...doc.data()}));
   return NextResponse.json(taskform);
}
export  async function POST(req:Request){
    try{
        const body=await req.json();
    const NewTaskRef= await addDoc(collection(db,"taskform"),{
        title: body.title,
        description: body.description||"",
        Completed:false,
        priority: body.priority ||"medium",
        CreatedAt:new Date(),
        updatedAt:new Date(),
    })
return NextResponse.json({
  id:NewTaskRef.id,
  title:body.title,
  description: body .description ||"",
  completed:false,
  priority: body.priority ||"medium",
  createdAt:new Date(),
  updatedAt:new Date(),
})
}catch(error){
    console.log("POST /api/taskform error", error);
    return NextResponse.json({error:"failed to add taskform"}, {status:500});
}}