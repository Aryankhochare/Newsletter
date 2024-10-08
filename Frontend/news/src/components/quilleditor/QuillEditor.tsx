"use client";
import dynamic from "next/dynamic";
import React, { useState, useCallback, memo, ChangeEvent, useRef, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { ReactQuillProps } from "react-quill";
import ImageUploader from "./ImageUploader";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { UUID } from "crypto";
 
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    const ForwardedQuill = ({
      forwardedRef,
      ...props
    }: ReactQuillProps & { forwardedRef: React.Ref<ReactQuillRef> }) => (
      <RQ ref={forwardedRef} {...props} />
    );
    ForwardedQuill.displayName = "ForwardedQuill";
    return ForwardedQuill;
  },
  { ssr: false }
);
 
const QuillNoSSRWrapper = React.forwardRef<ReactQuillRef, ReactQuillProps>(
  (props, ref) => <ReactQuill forwardedRef={ref} {...props} />
);
 
QuillNoSSRWrapper.displayName = "QuillNoSSRWrapper";
 
interface ImageData {
  file: File;
  imageName: string;
  url: string;
  base64Content: string;
}
 
interface ReactQuillRef {
  getEditor: () => any;
}
 
interface QuillEditorProps { //Added Interface for Props
  initialId? : string;
  initialTitle?: string;
  initialContent?: string;
  onSuccess: () => void;
}
 
const QuillEditor: React.FC<QuillEditorProps> = memo(({initialId = '', initialTitle = '', initialContent = '', onSuccess}) => { //Added initial data as empty
  const [title, setTitle] = useState<string>(initialTitle); //News Title
  const [selectedCategory, setSelectedCategory] = useState<string | null>(''); //Category
  const [coverImage, setCoverImage] = useState<File | null>(null); //Cover Image
  const [editorcontent, setEditorContent] = useState<string>(initialContent); //News Content
  const [resetTrigger, setResetTrigger] = useState(0);
  const [image, setImage] = useState<ImageData[]>([]);
  const [categories, setCategories] = useState<string[]>(["Politics", "Business", "Finance","Sports","Technology","Food","Tourism","Health","Crime","Education","Lifestyle","Environment"]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null); //ADDED ALERT USE STATE
 
  const handleCloseAlert = () => { //Closing alert !
    setAlertMessage(null);
  };
 
  const quillRef = useRef<ReactQuillRef>(null);
 
  const normalizeBase64 = (base64: string): string => {
    return base64.replace(/^data:image\/[^;]+;base64,/, '');
  };
 
  const cleanupImages = useCallback(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      if (quill) {
        const content = quill.root.innerHTML;
        const editorBase64Images = Array.from(new DOMParser().parseFromString(content, 'text/html').querySelectorAll('img'))
          .map(img => normalizeBase64((img as HTMLImageElement).src));
 
        setImage(prevImages =>
          prevImages.filter(image =>
            editorBase64Images.includes(normalizeBase64(image.base64Content))
          )
        );
      }
    }
  }, []);
 
  const handleChange = useCallback((content: string) => {
    setEditorContent(content);
    cleanupImages();
  }, [cleanupImages]);
 
  const handleTitle = (event: ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  };
 
  const handleImageChange = (file: File | null) => {
    setCoverImage(file);
  };
 
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };
 
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.setAttribute('multiple', 'multiple');
 
    input.click();
 
    input.onchange = async (event: Event) => {
      cleanupImages();
      const target = event.target as HTMLInputElement;
      const files = target.files;
      if (files) {
        try {
          const fileArray = Array.from(files);
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            if (range) {
              const newImages = await Promise.all(fileArray.map(async (file) => {
                const reader = new FileReader();
                return new Promise<ImageData>((resolve) => {
                  reader.onload = () => {
                    const base64Content = reader.result as string;
                    const imageName = `newsletter-image-${uuidv4()}-${file.name}`;
                    const url = `https://jlfphoepphgltjhlrwsp.supabase.co/storage/v1/object/public/news_image/${imageName}`;
                    quill.insertEmbed(range.index, 'image', base64Content);
                    quill.setSelection(range.index + 1, 0);
                    resolve({ file, imageName, url, base64Content });
                  };
                  reader.readAsDataURL(file);
                });
              }));
              setImage(prevImages => [...prevImages, ...newImages]);
            }
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image');
        }
      }
    };
  }, [cleanupImages]);
 
  const modules = {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
    },
  }
 
  const formats = [
    "header", "font", "size", "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "indent", "link", "image", "video",
  ];
 
  //////////////////////DRAFTING AND SAVING////////////////////
 
  // const handleDraft = async (e: React.FormEvent, isDraft: boolean) => {
  //   console.log("Drafted !");
  // }
 
  const saveNews = async (e: React.FormEvent, isDraft : boolean) => {
    e.preventDefault();
    if (!title || !editorcontent) {
      alert("Please fill all details !");
      return;
    }
 
    const quill = quillRef.current?.getEditor();
    if (quill) {
      let content = quill.root.innerHTML;
 
      image.forEach((imgData) => {
        const url = imgData.url;
     
      // Use a more general regex to match img tags with base64 content
      const regex = /<img[^>]*src="data:image\/[^"]+;base64,[^"]+"[^>]*>/g;
      content = content.replace(regex, (match: any) => {
        // Replace only if the base64 content matches
        if (match.includes(normalizeBase64(imgData.base64Content))) {
          return `<img src="${url}" alt="newsletter image">`;
        }
        return match;
      });
      });
 
      quill.root.innerHTML = content;
    }
 
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("EditorContent", quillRef.current?.getEditor().root.innerHTML || '');
    formData.append("IsDrafted", isDraft.toString());
    if (coverImage) {
      formData.append("CoverImage", coverImage);
    }
    else
    {
      // alert("Please enter a cover image !");
      setAlertMessage("Please enter a cover image!");
      return;
    }
 
    if (selectedCategory) {
      formData.append("CategoryName", selectedCategory);
    }
    else{
      // alert("Please enter a category !");
      setAlertMessage("Please enter a category !");
      return;
    }
 
    image.forEach((img, index) => {
      formData.append(`Images`, img.file);
      formData.append(`ImageNames`, img.imageName);
    });
    setTitle("");
    setCoverImage(null);
    setImage([]);
    setEditorContent("");
    setSelectedCategory(null);
    if (quillRef.current) {
      quillRef.current.getEditor().setText('');
    }
    setResetTrigger(prev => prev + 1);
    if (initialId == '') //If initialId is empty, make a new post
    {
      try {
        const response = await fetch("/api/newsletter", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Network response was not okay");
        }
        const data = await response.json();
        console.log("Newsletter created with id: ", data);
        onSuccess();
       
      } catch (error) {
        console.error("Error creating newsletter", error);
      }
    }
    else if (initialId != '') //If not empty, edit the post corresponding to the id in initialId
    {
      console.log(initialId);
      formData.append("Id", initialId); //Appending the id
      try {
        const response = await fetch("/api/newsletter", {
          method: "PATCH",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Network response was not okay");
        }
        const data = await response.json();
        console.log("Newsletter edited with id: ", data);
        onSuccess();
      } catch (error) {
        console.error("Error editing newsletter", error);
      }
    }
   
  };
 
  return (
    <>
    <div className="flex flex-col md:flex-row gap-4 mb-4 w-full">
    <div className="flex-grow w-full">
    <h2 className="text-lg font-bold mb-2">Article Title</h2>
    <input
                type="text"
                className="border-none text-2xl font-extrabold focus:outline-none focus:border-none p-2 w-full"
                value={title}
                onChange={handleTitle}
                placeholder="Enter Title"
              />
    <div className="mt-4">
    <label htmlFor="category" className="text-lg font-bold mb-2 block">
                   Category Selection
    </label>
    <select
                  id="category"
                  className="border border-gray-300 rounded-md p-2 w-3/4 max-h-40 overflow-y-auto"
                  value={selectedCategory || ''}
                  onChange={handleCategoryChange}
    >
    <option value="">Select a category</option>
                  {categories.map((category) => (
    <option key={category} value={category}>
                      {category}
    </option>
                  ))}
    </select>
    </div>
    </div>
    <div className="w-full md:w-full mt-4 md:mt-0 ">
    <ImageUploader onImageChange={handleImageChange} resetTrigger={resetTrigger} />
    </div>
    </div>
    <div>
    <QuillNoSSRWrapper
              ref={quillRef as React.Ref<ReactQuillRef>}
              modules={modules}
              formats={formats}
              placeholder="Enter Article"
              value={editorcontent}
              onChange={handleChange}
              theme="snow"
              className="w-full justify-center h-full"
            />
    <br/>
    <div className="py-0 justify-center mt-1 flex flex-wrap sm:z-5">
    <div className="hover:bg-gray-800 rounded-md px-4 py-2 m-2 text-center bg-black">
    <button onClick={(e) => saveNews(e, true)} className="text-white transition duration-300 ease-in-out text-center">
                  Save as Draft
    </button>
    </div>
    <div className="hover:bg-gray-800 rounded-md px-4 py-2 bg-black m-2">
    <button onClick={(e) => saveNews(e, false)} className="text-white transition duration-300 ease-in-out text-center">
                  Send for Review
    </button>
    </div>
    </div>
    </div>
     
          {alertMessage && (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center justify-between w-80 z-50">
    <span className="text-sm font-medium">{`Oops, you seem to be missing something! ${alertMessage}`}</span>
    <button
                onClick={handleCloseAlert}
                className="ml-4 text-xl font-bold"
    >
    &times;
    </button>
    </div>
          )}
    </>
      );
    });
     
    QuillEditor.displayName = "QuillEditor";
     
    export default QuillEditor;