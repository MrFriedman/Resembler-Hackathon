"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isDemoMode } from "@/lib/demo";

export default function Login() {
  const router = useRouter();
  const demo = isDemoMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (demo) {
      router.push("/dashboard");
      return;
    }

    if (!email || !password) {
      setMessage("Enter an email and password.");
      return;
    }

    const { signIn } = await import("next-auth/react");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.ok) {
      router.push("/dashboard");
      return;
    }
    setMessage("Login failed. Check the API is running and NEXTAUTH_SECRET is set.");
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
          Login Form
        </h2>
        <p className="text-gray-300 mb-6 text-center">
          {demo
            ? "Demo mode signs you in as Alex Naidoo. Any details work."
            : "Please enter your login details here"}
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="pb-5">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              User Password
            </label>
            <input
              id="password"
              className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {message && <p className="text-center text-red-400">{message}</p>}
          <button
            type="submit"
            className="block w-full bg-cyan-500 hover:bg-cyan-600 text-center text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-center text-gray-300 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-cyan-400 hover:underline">
          Sign up
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}
