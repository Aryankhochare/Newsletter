'use client'

import React, { useState, useEffect } from "react";
import QuillEditor from '../../components/QuillEditor';
import RejectedNews from '@/components/RejectedNews';


interface News {
  id: string;
  title: string;
  editorcontent: string;
} 

export default function Home() {

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg text-gray-900">
      <RejectedNews />
      </div>
      
    </main>
  );
}