"use client";
import dynamic from "next/dynamic";
import React, { useState, useCallback, memo, ChangeEvent, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import { ReactQuillProps } from "react-quill";
import ImageUploader from "./ImageUploader";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

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
  //initialCoverImage? : string;
  initialTitle?: string; 
  initialContent?: string;
  onSave?: (title: string, content: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = memo(({initialContent = '', initialTitle = '', onSave }) => { //Added initial data as empty 
  const [editorcontent, setEditorContent] = useState<string>(initialContent);
  const [title, setTitle] = useState<string>(initialTitle);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [image, setImage] = useState<ImageData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["Politics", "Business", "Finance"]);

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

  const handleupload = () => {
    console.log(image);
  }

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

  const saveNews = async (e: React.FormEvent) => {
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
    if (coverImage) {
      formData.append("CoverImage", coverImage);
    }

    if (selectedCategory) {
      formData.append("CategoryName", selectedCategory);
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
     
    } catch (error) {
      console.error("Error creating newsletter", error);
    }
  };

  return (
    <>
      <div className="flex gap-4 mb-4 w-full">
        <div className="flex-grow w-full">
          <h2 className="text-lg font-bold mb-2">Enter Title</h2>
          <input
            type="text"
            className="border-none text-2xl font-extrabold focus:outline-none focus:border-none p-2 w-full"
            value={title}
            onChange={handleTitle}
            placeholder="Enter Title"
          />
          <div className="mt-4">
            <label htmlFor="category" className="text-lg font-bold mb-2 block">
              Select Category
            </label>
            <select
              id="category"
              className="border border-gray-300 rounded-md p-2 w-full"
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
        <div className="w-full">
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
        <div className=" py-0 justify-center mt-1 flex flex-grow sm:z-5">
          <div className="hover:bg-gray-800 rounded-md px-4 py-2 m-2 text-center bg-black ">
            <button onClick={handleupload} className="text-white transition duration-300 ease-in-out text-center">
              Save
            </button>
          </div>
          <div className=" hover:bg-gray-800 rounded-md px-4 py-2 bg-black m-2">
            <button onClick={saveNews} className="text-white transition duration-300 ease-in-out text-center">
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;