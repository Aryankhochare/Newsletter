'use client'

import Link from "next/link";
import { useState } from "react";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";
//import { Button } from '@/components/button';
import { FcGoogle } from 'react-icons/fc';
//import { Label } from '@/components/label';

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

    <main className="bg-black text-white min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6">LOGIN</h1>
          <p className="text-gray-400 text-center mb-8">Welcome </p>

          <div>
            <button className="flex items-center justify-center w-full gap-4 bg-white text-black hover:bg-gray-100 rounded-full py-2 px-4">
              <FcGoogle className="text-xl" />
              <span>Sign In with Google</span>
            </button>
            </div>
            
            
          <form onSubmit={onSubmit} className="space-y-6">

            <div className="space-y-2">
              <label htmlFor="username" className="block">UserName</label>
              <input 
                className="w-full p-3 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                id="username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block">Password</label>
              <input 
                className="w-full p-3 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 rounded-full py-3">
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-400">Don&apos;t have an account?</p>
            <a href="/signup" className="text-blue-400 hover:underline">Sign up</a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;