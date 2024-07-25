"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
 
export default function Home() {
    const router = useRouter();
    const handleUser = () => {
      router.push('/login');
    };
    
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="text-center bg-gray-700 p-10 rounded-lg shadow-xl">
        <h1 className="text-5xl font-bold text-white mb-8">NewsLetter</h1>
        <div className="space-y-4">
          <button 
            onClick={handleUser}
            className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-8 rounded-full text-xl"
          >
            Login
          </button>
          <div>
            <a href="#" className="text-white underline text-sm">Login As Guest</a>
          </div>
        </div>
      </div>
    </main>
  );
}