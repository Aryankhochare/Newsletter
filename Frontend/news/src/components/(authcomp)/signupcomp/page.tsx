"use client"
import React from 'react';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";

export default function SignupComp() {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      password: ''
    });
  
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      console.log(formData);
    };
  
  return (
    <div>
        <div className="bg-gray-800 rounded-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              className="w-full p-5 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              className="w-full p-5 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Enter your Phone No."
              className="w-full p-5 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="w-full p-5 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-full py-3 text-white font-bold"
            >
              SUBMIT
            </button>
             
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300 p-1">OR</p>
            <p></p>
            </div>
            <div>
            <button className="flex items-center justify-center w-full gap-4 bg-white text-black hover:bg-gray-100 rounded-full py-2 px-4">
            <FcGoogle className="text-xl" />
            <span>Sign Up with Google</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
          </p>
        </div>
    </div>
  )
}
