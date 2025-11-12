"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
         await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Now goes to root (dashboard)
    } catch (err: any) {
      setError(err.message);
    }
  };
    return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
    <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
             onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-black rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-black rounded-lg focus:ring-2 focus:ring1 focus:ring-indigo-500"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition">
            Login
          </button>
          type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition">
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          No account?{" "}
          <a href="/register" className="text-indigo-600 font-semibold hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}