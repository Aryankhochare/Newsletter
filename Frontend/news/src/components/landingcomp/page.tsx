'use client'
import { useRouter } from 'next/navigation';

export default function LandComp() {
    const router = useRouter();
    const handlerClick = () => {
        router.push('/login');
    }
    const handlerUser = () => {
        router.push('/signup');
    }
    const handleGuestSignup = () => {
        
        router.push('main');
      };
    return (
        <div className="relative h-screen w-full overflow-hidden">
          <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover -z-1"
                onError={(e) => console.error("Video playback error:", e)}
            >
                <source src="./my-background-video.mp4" type="video/mp4" />
                <source src="./my-background-video.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>
            
            
            
            <div className="relative z-10 h-full flex flex-col items-center justify-center mt-4">
                {/* Newsletter Name */}
                <h1 className="text-3xl md:text-6xl font-bold text-white mb-8 text-center">
                    THE GLOBAL BUZZ
                </h1>
                {/* Buttons Container */}
                <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0 py-3 ">
                    <button onClick={handlerClick}
                        className=" w-40 hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out border-2 ">
                        Login
                    </button>
                    <button onClick={handlerUser} 
                        className="w-40 border-white bg-white text-black hover:bg-black hover:text-white  border-2 font-bold py-2 px-4 rounded transition duration-300 ease-in-out ">
                        Sign Up
                    </button>
                </div>
                <div>
                    <a href="#" 
                    onClick={handleGuestSignup}
                    className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out order-last mt-4 md:order-none md:mt-0 underline">
                    Sign In as a guest
                    </a>
                </div>
           </div>
            
            
        </div>
    )
}