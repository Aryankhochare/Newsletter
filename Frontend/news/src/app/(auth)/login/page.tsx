// 'use client'

// import Link from "next/link";
// import { useState } from "react";
// import { signIn, SignInResponse } from "next-auth/react";
// import { useRouter } from "next/navigation";
// //import { Button } from '@/components/button';
// import { FcGoogle } from 'react-icons/fc';
// //import { Label } from '@/components/label';

// const LoginPageComp = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const onSubmit = async (e : any) => {
//     e.preventDefault();
//     setError("");

  //   try {
  //     const result : any = await signIn("credentials", {
  //       username,
  //       password,
  //       redirect: false,
  //     });

  //     if (result.error) {
  //       setError("Invalid username or password");
  //     } else {
  //       router.push("/");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     setError("An error occurred during login");
  //   }
  // };

//   return (

//     <main className="bg-black text-white min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
//       <div className="w-3/4 h-3/5 max-w-md min-h-screen  bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
//         <div className="p-8 space-y-2 ">
//           <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6">LOGIN</h1>
//           <p className="text-gray-400 text-center mb-8">Welcome </p>

//           <div>
//             <button className="flex items-center justify-center w-full gap-4 bg-white text-black hover:bg-gray-100 rounded-full py-2 px-4">
//               <FcGoogle className="text-xl" />
//               <span>Sign In with Google</span>
//             </button>
//             </div>
            
            
//           <form onSubmit={onSubmit} className="space-y-6">

//             <div className="space-y-2">
//               <label htmlFor="username" className="block">UserName</label>
//               <input 
//                 className="w-full p-3 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 type="text"
//                 id="username"
//                 placeholder="Username"
//                 onChange={(e) => setUsername(e.target.value)}
//                 value={username}
//               />
//             </div>

//             <div className="space-y-2">
//               <label htmlFor="password" className="block">Password</label>
//               <input 
//                 className="w-full p-3 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 type="password"
//                 id="password"
//                 placeholder="Password"
//                 onChange={(e) => setPassword(e.target.value)}
//                 value={password}
//               />
//             </div>
//             {error && <p className="text-red-500">{error}</p>}

//             <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 rounded-full py-3">
//               Login
//             </button>
//           </form>

          // <div className="mt-4 text-center">
          //   <p className="text-gray-400">Don&apos;t have an account?</p>
          //   <a href="/signup" className="text-blue-400 hover:underline">Sign up</a>
          // </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default LoginPageComp ;





// 'use client'

// import Link from "next/link";
// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { FcGoogle } from 'react-icons/fc';
// import { FaFacebookF } from 'react-icons/fa';

// const LoginPageComp = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const onSubmit = async (e : any) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const result : any = await signIn("credentials", {
//         username,
//         password,
//         redirect: false,
//       });

//       if (result.error) {
//         setError("Invalid username or password");
//       } else {
//         router.push("/");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("An error occurred during login");
//     }
//   };

//   return (
//     <main className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
//       <div className="sm:w-full md:w-4/5 max-w-6xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
//         <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
//           <h1 className="text-4xl font-bold text-black text-center mb-4">The Global Buzz</h1>
//           <p className="text-gray-600 text-center text-sm mb-8">"Delivering the World's Hottest Buzz, Packed with Global Insight"</p>

//           <p className="text-xs text-gray-500 mb-4">By continuing you indicate that you agree to The Global Buzz's Terms of Service and Privacy Policy.</p>

//           <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-50 mb-4">
//             <FcGoogle className="text-xl" />
//             <span>Continue with Google</span>
//           </button>

//           <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 mb-4">
//             <FaFacebookF className="text-xl" />
//             <span>Continue with Facebook</span>
//           </button>

//           <div className="text-center text-sm text-gray-500">
//             <a href="#" className="text-gray-500 hover:underline hover:text-black text-sm">Continue as Guest</a>
//           </div>
//         </div>

//         <div className="w-full md:w-1/2   bg-gray-50 flex flex-col justify-center">
//         <div className="text-black text-2xl font-semibold text-center p-2  mt-0  ">Login</div>
//           <form onSubmit={onSubmit} className="space-y-4 p-8">
//             <div className="space-y-2">
//               <div className="text-sm">Username/Email:</div>
//               <input 
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 type="text"
//                 placeholder="Your email"
//                 onChange={(e) => setUsername(e.target.value)}
//                 value={username}
//               />
//             </div>

//             <div className="space-y-2">
//             <div className="text-sm">Password:</div>
//               <input 
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 type="password"
//                 placeholder="Your password"
//                 onChange={(e) => setPassword(e.target.value)}
//                 value={password}
//               />
//             </div>

//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <div className="flex justify-between items-center">
//               <a href="#" className="text-sm text-gray-500 hover:underline hover:text-black">Forgot password?</a>
//               <button type="submit" className="bg-black text-white rounded-md py-1 px-4 hover:bg-slate-800  ">
//                 Login
//               </button>

//             </div>
//             <div className="mt-4 text-center">
//             <p className="text-gray-400">Don&apos;t have an account?</p>
//             <a href="/signup" className="text-gray-500 hover:underline hover:text-black">Sign up</a>
//           </div>
//           </form>
//         </div>
//       </div>

//       {/* <div className="absolute bottom-4 left-0 right-0 text-center">
       
//         <p className="text-xs text-gray-500 mt-1 bottom-0">© The Global Buzz, Inc. 2024</p>
//       </div> */}
//     </main>
//   );
// };

// export default LoginPageComp;

'use client'

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const LoginPageComp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="sm:w-full md:w-4/5 max-w-6xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-black text-center mb-4">The Global Buzz</h1>
          <p className="text-gray-600 text-center text-sm mb-8">"Delivering the World's Hottest Buzz, Packed with Global Insight"</p>

          <p className="text-xs text-gray-500 mb-4">By continuing you indicate that you agree to The Global Buzz's Terms of Service and Privacy Policy.</p>

          <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-50 mb-4">
            <FcGoogle className="text-xl" />
            <span>Continue with Google</span>
          </button>

          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 mb-4">
            <FaFacebookF className="text-xl" />
            <span>Continue with Facebook</span>
          </button>

          <div className="text-center text-sm text-gray-500">
            <a href="#" className="text-gray-500 hover:underline hover:text-black text-sm">Continue as Guest</a>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col justify-center">
          <div className="text-black text-2xl font-semibold text-center p-2 mt-0">Login</div>
          <form onSubmit={onSubmit} className="space-y-4 p-8">
            <div className="space-y-2">
              <div className="text-sm">Username/Email:</div>
              <input 
                className="w-full p-2 border border-gray-300 rounded-md"
                type="text"
                placeholder="Your email"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
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
              <a href="#" className="text-sm text-gray-500 hover:underline hover:text-black">Forgot password?</a>
              <button type="submit" className="bg-black text-white rounded-md py-1 px-4 hover:bg-slate-800">
                Login
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-400">Don&apos;t have an account?</p>
              <a href="/signup" className="text-gray-500 hover:underline hover:text-black">Sign up</a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginPageComp;
