
'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { DM_Serif_Display } from 'next/font/google';
const Dmse = DM_Serif_Display({ subsets: ["latin"], weight: ["400"] });


const LoginPageComp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleChange = (e : any) => {
    const { name, value } = e.target;
    setUsername(name === 'username' ? value.trim() : value);
  };

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
        router.push("/main");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      router.push("/main");
    }
  }, [status, router]);

  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="sm:w-full md:w-4/5 max-w-6xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className={`${Dmse.className} text-4xl text-black text-center mb-4 md:mb-8`}>The Global Buzz</h1>
          <p className="text-gray-600 text-center text-sm mb-8">&quot;Delivering the World&apos;s Hottest Buzz, Packed with Global Insight&quot;</p>

          <p className="text-xs text-gray-500 mb-4">By continuing you indicate that you agree to The Global Buzz&apos;s Terms of Service and Privacy Policy.</p>

          <button onClick={() => signIn("google", {callbackUrl:'/main'})} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-50 mb-4">
            <FcGoogle className="text-xl" />
            <span>Continue with Google</span>
          </button>

          <button onClick = {() => signIn("facebook")}className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 mb-4">
            <FaFacebookF className="text-xl" />
            <span>Continue with Facebook</span>
          </button>

          <div className="text-center text-sm text-gray-500">
            <Link href="/main" className="text-gray-500 hover:underline hover:text-black text-sm">Continue as Guest</Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col justify-center">
          <div className="text-black text-2xl font-semibold text-center p-2 md:mb-0 mt-8 py-9">Login</div>
          <form onSubmit={onSubmit} className="space-y-4 p-8 -mt-6">
            <div className="space-y-2 mb-6">
              <div className="text-sm">Username/Email:</div>
              <input 
                className="w-full p-2 border border-gray-300 rounded-md"
                name="username"
                type="text"
                placeholder="Your email"
                onChange={handleChange}
                value={username}
                required
              />
            </div>

            <div className="space-y-2 relative">
              <div className="text-sm">Password:</div>
              <input 
              
                className="w-full p-2 border border-gray-300 rounded-md"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <div
                className="absolute inset-y-0 pt-6 right-2  flex  cursor-pointer items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  < AiFillEye className="text-gray-500" />
                ) : (
                  <AiFillEyeInvisible className="text-gray-500" />
                )}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-between items-center">
              <Link href="#" className="text-sm text-gray-500 hover:underline hover:text-black">Forgot password?</Link>
              <button type="submit" className="bg-black text-white rounded-md py-1 px-4 hover:bg-slate-800">
                Login
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-400">Don&apos;t have an account?</p>
              <Link href="/signup" className="text-gray-500 hover:underline hover:text-black">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginPageComp;
