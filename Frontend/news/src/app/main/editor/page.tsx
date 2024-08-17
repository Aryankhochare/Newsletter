import EditorButtons from "@/components/EditorButtons";
import { Suspense } from "react";
import Navbar from "@/components/navbarcomp/navbar";
import Footer from "@/components/navbarcomp/footer";

const fetchContent = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ASP_NET_URL}/newsletter`,
      {
        cache: "no-store",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching content:", error);
  }
};

export default async function EditorPage() {
  const data = await fetchContent();

  return (
    <>
    <div className="sticky top-0 z-50">
        <Navbar />
      </div>
    <Suspense fallback={<div>Loading...</div>}>
      <EditorButtons Data={data} />
    </Suspense>
    <Footer/>
    </>
  );
}
