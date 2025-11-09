"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/login");
    } catch (err) {
      alert("Registration failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleRegister} className="p-6 border rounded">
        <h2 className="text-lg font-bold mb-3">Register</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 mb-2 w-full" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2 mb-2 w-full" />
        <button className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
      </form>
      <p className="mt-2 text-sm">
        Already have an account? <a href="/login" className="text-blue-600">Login</a>
      </p>
    </div>
  );
}
