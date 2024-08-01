'use client'

import React from "react";
import QuillEditor from '../../components/QuillEditor';
import ImageUploader from "@/components/ImageUploader";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create Article :
      </h1>
      <ImageUploader/>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg text-gray-900">
        
        <QuillEditor />
      </div>
    </main>
  );
}
