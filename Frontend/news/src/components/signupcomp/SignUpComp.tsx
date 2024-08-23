// 'use client';
// import axios from 'axios';
// import { useState } from 'react';
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebookF } from 'react-icons/fa';
// import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
// import Link from 'next/link';
// import { signIn } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// export default function SignUpComp() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: ''
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   const router = useRouter();

//   const handleChange = (e: { target: { name: any; value: any; }; }) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/auth/register', {
//         username: formData.name,
//         password: formData.password,
//         email: formData.email
//       });
      
//       if (response.status === 200) {
//         alert(response.data.message);
//         router.push("/main");
//       }
//     } catch (error) {
//       console.error('Error during sign up:', error);
//       alert('Failed to sign up. Please try again.');
//     }
//   };

//   return (
//     <main className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
//       <div className="sm:w-full md:w-4/5 max-w-6xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
//         <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
//           <h1 className="text-4xl font-bold text-black text-center mb-4">The Global Buzz</h1>
//           <p className="text-gray-600 text-center text-sm mb-8">&quot;Delivering the World&apos;s Hottest Buzz, Packed with Global Insight&quot;</p>

//           <p className="text-xs text-gray-500 mb-4">By continuing you indicate that you agree to The Global Buzz&apos;s Terms of Service and Privacy Policy.</p>

//           <button onClick={() => signIn("google")} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-50 mb-4">
//             <FcGoogle className="text-xl" />
//             <span>Continue with Google</span>
//           </button>

//           <button onClick = {() => signIn("facebook")}className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 mb-4">
//             <FaFacebookF className="text-xl" />
//             <span>Continue with Facebook</span>
//           </button>

//           <div className="text-center text-sm text-gray-500">
//             <Link href="/main" className="hover:underline">Continue as Guest</Link><br/>
//             <div>
//               <a className="text-xs">Already have an Account? </a>
//               <Link href="/login" className="hover:underline text-xs">Log In</Link>
//             </div>
//           </div>
//         </div>

//         <div className="w-full md:w-1/2 p-3 bg-gray-50 flex flex-col justify-center">
//           <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
//           <form onSubmit={handleSubmit} className="space-y-2 pt-0 p-8">
//             <div className="space-y-0">
//               <div className="text-sm m-0 p-0">Name:</div>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Enter your Name"
//                 className="w-full p-2 border border-gray-300 rounded-md text-xs"
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="space-y-0">
//               <div className="text-sm">Email:</div>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your Email"
//                 className="w-full p-2 border border-gray-300 rounded-md text-xs"
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="space-y-0">
//               <div className="text-sm">Phone No.:</div>
//               <input
//                 type="tel"
//                 name="phone"
//                 placeholder="Enter your Phone No."
//                 className="w-full p-2 border border-gray-300 rounded-md text-xs"
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="space-y-0 relative">
//               <div className="text-sm">Password:</div>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Enter Password"
//                 className="w-full p-2 border border-gray-300 rounded-md text-xs"
//                 onChange={handleChange}
//                 required
//               />
//               <div
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <AiFillEyeInvisible className="text-gray-500" />
//                 ) : (
//                   <AiFillEye className="text-gray-500" />
//                 )}
//               </div>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md"
//             >
//               SUBMIT
//             </button>
//           </form>
//         </div>
//       </div>
//     </main>
//   );
// }
'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { DM_Serif_Display } from 'next/font/google';
const Dmse = DM_Serif_Display({ subsets: ["latin"], weight: ["400"] });

export default function SignUpComp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const session=useSession()
  const router = useRouter();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'name' ? value.trim() : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
       alert(passwordError);
       return;
    }

    const emailError = validateEmail(formData.email);
    if(emailError){
      alert(emailError);
      return;
    }
    
    try {
      const result = await signIn("register", {
        username: formData.name,
        password: formData.password,
        email: formData.email,
        redirect: false,
      });
  
      if (result?.error) {
        console.log("Error while registering user:", result.error);
      
      } else {
     
        console.log("User registered successfully");
        router.push("/main");
      }
    } catch (error) {
      console.error("Error during registration:", error);
  
    }
  };

  const validatePassword = (password : any) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one digit';
    }
    if (!/[@$!%*?&]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const validateEmail = (email : string) => {
    if (!/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/.test(email)){
      return 'Incorrect email format';
    }
  }

  useEffect(()=>{
    if(session.data?.user){
      console.log(session)
      redirect('/')
    }

  },[session])
  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="sm:w-full md:w-4/5 max-w-6xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className={`${Dmse.className} text-4xl text-black text-center mb-4 md:mb-8`}>The Global Buzz</h1>
          <p className="text-gray-600 text-center text-sm mb-8">&quot;Delivering the World&apos;s Hottest Buzz, Packed with Global Insight&quot;</p>

          <p className="text-xs text-gray-500 mb-4">By continuing you indicate that you agree to The Global Buzz&apos;s Terms of Service and Privacy Policy.</p>

          <button onClick={() => signIn("google")} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-50 mb-4">
            <FcGoogle className="text-xl" />
            <span>Continue with Google</span>
          </button>

          <button onClick={() => signIn("facebook")} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 mb-4">
            <FaFacebookF className="text-xl" />
            <span>Continue with Facebook</span>
          </button>

          <div className="text-center text-sm text-gray-500">
            <Link href="/main" className="hover:underline">Continue as Guest</Link><br/>
            <div>
              <a className="text-xs">Already have an Account? </a>
              <Link href="/login" className="hover:underline text-xs">Log In</Link>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-3 bg-gray-50 flex flex-col justify-center mt-0">
          <h2 className="text-2xl font-semibold text-center  mb-3 md:mb-0">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-2 pt-0 p-8 mt-5">
            <div className="space-y-0">
              <div className="text-sm m-0 p-0">Name:</div>
              <input
                type="text"
                name="name"
                placeholder="Enter your Name"
                className="w-full p-2 border border-gray-300 rounded-md text-xs"
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-0">
              <div className="text-sm">Email:</div>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                className="w-full p-2 border border-gray-300 rounded-md text-xs"
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-0">
              <div className="text-sm">Phone No.:</div>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your Phone No."
                className="w-full p-2 border border-gray-300 rounded-md text-xs"
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-0 relative">
              <div className="text-sm">Password:</div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                className="w-full p-2 border border-gray-300 rounded-md text-xs"
                onChange={handleChange}
                minLength={6}
                required
              />
              <div
                className="absolute inset-y-0 pt-6 right-2  flex  cursor-pointer items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="text-gray-500" />
                ) : (
                  <AiFillEye className="text-gray-500" />
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
