import HomePage from "./page";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

default function Login() {
  const [data, setData] = useState({
    name : '',
    password : '',
  })
}

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="bg-gray-700 p-8 rounded-lg shadow-xl w-80">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Login</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-white mb-1">Username:</label>
            <input
              id="username"
              type="text"
              className="w-full px-3 py-2 bg-gray-200 rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white mb-1">Password:</label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 bg-gray-200 rounded"
            />
          </div>
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