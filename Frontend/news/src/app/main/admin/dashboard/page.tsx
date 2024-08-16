import DashboardComp from "@/components/admincomp/dashboardcomp/page";
import Navbar from "@/components/navbarcomp/navbar";
import Footer from "@/components/navbarcomp/footer";
import Link from "next/link";


export default function AdminDashboard() {
  return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
              <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Link
          href="#"
          className="flex items-center gap-2 font-semibold p-3 m-1"
          prefetch={false}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="4em"
            height="3em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7L4 8v10h16V8zm0-2l8-5H4zM4 8V6v12z"
            ></path>
          </svg>

          <div className="text-4xl">Newsletter Dashboard</div>
        </Link>
      </header>
      <DashboardComp />
      < div className='bottom-0 z-50 mt-2 '>
      <Footer/>
    </div>
      
      
    </div>
  );
}