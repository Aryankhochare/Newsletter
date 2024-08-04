'use client'
import dynamic from 'next/dynamic';
import React, { useState, useCallback, memo, ChangeEvent } from 'react';
import 'react-quill/dist/quill.snow.css';
import { ReactQuillProps } from 'react-quill';
import ImageUploader from './ImageUploader';

const QuillNoSSRWrapper = dynamic<ReactQuillProps>(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});

const modules = { //Also move these outside
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
        ],
        ['link', 'image', 'video'],
        ['clean'],
    ],
    clipboard: {
        matchVisual: false,
    },
};

const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
];

const QuillEditor : React.FC = memo(() => {
    const saveNews = async (e : any) => {
        e.preventDefault();
        if (!title || !editorcontent)
        {
          alert("Please fill all details !");
          return
        }
        // console.log(title, editorcontent);
        const formData = new FormData();
        formData.append('Title', title);
        formData.append('EditorContent', editorcontent);
        if(coverImage){
          formData.append('CoverImage', coverImage);
        }
        try{
          const response = await fetch('/api/newsletter',{
            method: 'POST',
            body: formData,
          });
          if(!response.ok){
            throw new Error('Network response was not okay');
          }
          const data = await response.json();
          console.log("Newsletter created with id: ", data);          
        }
        catch(error){
          console.error("Error creating newsletter",error);
        }
      } 
    const [editorcontent, setEditorContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [coverImage, setCoverImage] = useState<File|null>(null);

    const handleChange = useCallback((content : string) => { //setCallback is a hook that returns a memoized version of the callback function. It only changes if one of the dependencies has changed. In this case, the empty dependency array [] means this function will only be created once and reused across re-renders. This can be beneficial when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.
        setEditorContent(content);
    }, []);

    const handleTitle = (event : ChangeEvent<HTMLInputElement>) : void=> {
        setTitle(event.target.value);
    };

    const handleImageChange = (file : File|null) => {
      setCoverImage(file);
    };
  
    return (
        <>
        <ImageUploader onImageChange = {handleImageChange}/>
        <input 
          type="text" 
          className = "border-none focus:outline-none  focus:border-none p-2 w-full" 
          value = {title}
          onChange = {handleTitle}
          placeholder="Enter Title" 
        />
        <div>
            <QuillNoSSRWrapper 
                modules={modules} 
                formats={formats} 
                placeholder='Enter Article'
                value={editorcontent} 
                onChange={handleChange} 
                theme="snow" 
            />
            <button onClick = {saveNews}>Post</button>
        </div>
      </>
    );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;