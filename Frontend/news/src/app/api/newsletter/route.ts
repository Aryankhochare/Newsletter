import { NextRequest, NextResponse} from "next/server";
import { getServerSession } from "next-auth";
import FormData from "form-data";
import fetch from "node-fetch";
import { authOptions } from "../auth/[...nextauth]/route";

declare module "next-auth" {
  interface Session {
    accessToken: string;
  }
}


export async function POST(req: NextRequest) {
  try {

    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const form = new FormData();

    console.log("Received form data:", Object.fromEntries(formData));

    const title = formData.get("Title");
    const content = formData.get("EditorContent");
    const categoryName = formData.get("CategoryName");

    if (typeof title === "string") {
      form.append("Title", title);
    }
    if (typeof content === "string") {
      form.append("EditorContent", content);
    }

    if(typeof categoryName === "string"){
      form.append("CategoryName", categoryName);
    }

    const file = formData.get("CoverImage") as File | null;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      form.append("CoverImage", buffer, {
        filename: file.name,
        contentType: file.type,
      });
    }

    const images = formData.getAll("Images");
    const imageNames = formData.getAll("ImageNames");

    for (let i = 0; i < images.length; i++) {
      const image = images[i] as File;
      const imageName = imageNames[i] as string;
      const buffer = Buffer.from(await image.arrayBuffer());
      form.append("Images", buffer, {
        filename: image.name,
        contentType: image.type,
      });
      form.append("ImageNames", imageName);
    }

    console.log("FormData to be sent:", form);

    const response = await fetch(`${process.env.ASP_NET_URL}/newsletter`, {
      method: "POST",
      body: form as any,
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${session.accessToken}`
      },
    });

    console.log("Backend response status:", response.status);
    console.log("Backend response status:", response);
    const responseText = await response.text();
    console.log("Backend response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Backend request failed with status ${response.status}: ${responseText}`
      );
    }

    const data = JSON.parse(responseText);
    console.log(data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        error: "Error submitting to backend",
        details: "an unknown error occured",
      },
      { status: 500 }
    );
  }
}
