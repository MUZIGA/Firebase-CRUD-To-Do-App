"use client";
import Protected from "@components/Protected";
import { auth } from "@lib/firebase";
import { useAuth } from "@context/Authcontext";
import { signOut } from "firebase/auth";

// ...existing code...
export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Protected>
      <div className="max-w-lg mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Hello, {user?.email}
          </h1>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </Protected>
  );
}
