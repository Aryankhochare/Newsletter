'use client'

import Link from "next/link";
import { useState } from "react";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e : any) => {
    e.preventDefault();
    setError("");

    try {
      const result : any = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result.error) {
        setError("Invalid username or password");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="bg-gray-700 p-8 rounded-lg shadow-xl w-80">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-white mb-1">Username:</label>
            <input
              id="username"
              type="text"
              className="w-full px-3 py-2 bg-gray-200 rounded"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white mb-1">Password:</label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 bg-gray-200 rounded"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-gray-300 hover:text-white">
              Forgot Password?
            </Link>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;