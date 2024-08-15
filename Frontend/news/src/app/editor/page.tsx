import EditorButtons from "@/components/EditorButtons";
import { Suspense } from "react";

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
    <Suspense fallback={<div>Loading...</div>}>
      <EditorButtons Data={data} />
    </Suspense>
  );
}
