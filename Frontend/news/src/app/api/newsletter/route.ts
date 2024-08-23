import { NextRequest, NextResponse} from "next/server";
import { getServerSession } from "next-auth";
import FormData from "form-data";
import fetch from "node-fetch";
import { authOptions } from "../auth/[...nextauth]/options";
import { apiLinks } from "@/utils/constants";


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
    const isDrafted = formData.get("IsDrafted") === 'true';

    if (typeof title === "string") {
      form.append("Title", title);
    }
    if (typeof content === "string") {
      form.append("EditorContent", content);
    }

    if(typeof categoryName === "string"){
      form.append("CategoryName", categoryName);
    }

    form.append("IsDrafted", isDrafted.toString());

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

    const response = await fetch(`${apiLinks.newsletter.fetch}`, {
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

/////////////////////////////PATCH///////////////////////

export async function PATCH(req: NextRequest) {
  try {

    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const form = new FormData();

    console.log("Received form data:", Object.fromEntries(formData));
    
    const news_id = formData.get("Id");
    const title = formData.get("Title");
    const content = formData.get("EditorContent");
    const categoryName = formData.get("CategoryName");
    const isDrafted = formData.get("IsDrafted") === 'true';

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
    form.append("IsDrafted", isDrafted.toString());

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

    const response = await fetch(`${apiLinks.newsletter.fetch}/${news_id}`, {
      method: "PATCH",
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

export async function DELETE(req: NextRequest) {
  try {
      const {id} = await req.json();
      const response = await fetch(`${apiLinks.newsletter.fetch}/${id}`, {
          method : 'DELETE',
          headers : {'Content-Type': 'application/json',
          },
          body:JSON.stringify({id}),
      });
          
      const responseText = await response.text();
      console.log(`ASP.NET in raw response : ${responseText}`)
      if (!response.ok) {
          console.error('ASP.NET API responded with status ${response.status}: ${responseText}');
          return NextResponse.json(`{ error: Failed to delete article to ASP.NET API: ${responseText} }`, { status: response.status });
      }
      let responseData;
      try {
          responseData = JSON.parse(responseText);
      } catch (parseError) {
          console.error('Error parsing JSON response:', parseError);
              return NextResponse.json({ error: 'Invalid JSON response from server' }, { status: 500 });
          }
          
          return NextResponse.json(responseData);
      } catch (error) {
          console.error('Detailed error:', error);
          return NextResponse.json({ error: 'Error deleting article!'}, { status: 500 });
      }
  }



