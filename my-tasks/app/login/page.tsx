"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";         // <- relative path
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      alert("Login failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="p-6 border rounded">
        <h2 className="text-lg font-bold mb-3">Login</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 mb-2 w-full" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2 mb-2 w-full" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </form>
      <p className="mt-2 text-sm">
        Don’t have an account? <a href="/register" className="text-blue-600">Register</a>
      </p>
    </div>
  );
}
