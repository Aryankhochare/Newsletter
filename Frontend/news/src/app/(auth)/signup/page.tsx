// 'use client';
// import axios from 'axios';
// //import { Button } from '@/components/button';
// import Head from 'next/head';
// import { useState } from 'react';
// import { FcGoogle } from "react-icons/fc";

// export default function SignUp() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: ''
//   });

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
//       }
//     } catch (error) {
//       console.error('Error during sign up:', error);
//       alert('Failed to sign up. Please try again.');
//     }
//   };


//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      

//       <main className="w-full max-w-md">
//         <h1 className="text-center mb-6 text-lg sm:text-xl md:text-2xl px-4 italic">
//           Join our newsletter to receive the latest news, articles, and updates directly in your inbox!
//         </h1>
        
//         <Head>
//         <title>SIGN UP</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//         <div className="bg-gray-800 rounded-lg p-6 sm:p-8">
//           <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Sign Up</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter your Name"
//               className="w-full p-5 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your Email"
//               className="w-full p-5 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="tel"
//               name="phone"
//               placeholder="Enter your Phone No."
//               className="w-full p-5 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               onChange={handleChange}
//               required
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter Password"
//               className="w-full p-5 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               onChange={handleChange}
//               required
//             />
//             <button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 rounded-full py-3 text-white font-bold"
//             >
//               SUBMIT
//             </button>
             
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-300 p-1">OR</p>
//             <p></p>
//             </div>
//             <div>
//             <button className="flex items-center justify-center w-full gap-4 bg-white text-black hover:bg-gray-100 rounded-full py-2 px-4">
//             <FcGoogle className="text-xl" />
//             <span>Sign Up with Google</span>
//             </button>
//           </div>

//           <p className="mt-6 text-center text-sm text-gray-400">
//             Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
//           </p>
//         </div>
//       </main>
//     </div>
//   );
// }













'use client';
import axios from 'axios';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', {
        username: formData.name,
        password: formData.password,
        email: formData.email
      });
      
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      alert('Failed to sign up. Please try again.');
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
            <a href="/main" className="hover:underline">Continue as Guest</a><br/>
            <div>
              <a className="text-xs">Already have an Account? </a>
              <a href="/login" className="hover:underline text-xs">Log In</a>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-3 bg-gray-50 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-2 pt-0 p-8">
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
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
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
