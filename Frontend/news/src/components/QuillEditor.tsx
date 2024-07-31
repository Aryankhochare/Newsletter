'use client'
import dynamic from 'next/dynamic';
import React, { useState, useCallback, memo, ChangeEvent } from 'react';
import 'react-quill/dist/quill.snow.css';
import { ReactQuillProps } from 'react-quill';
import { supabase } from '@/app/api/auth/[...nextauth]/route';

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
        const {data, error} = await supabase
          .from('NewsTest')
          .insert([{ title, editorcontent}])
        
        if (error) {
          console.log(error);
        }
    
        if (data) {
          console.log(data);
        }
      } 
    const [editorcontent, setEditorContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const handleChange = useCallback((content : string) => { //setCallback is a hook that returns a memoized version of the callback function. It only changes if one of the dependencies has changed. In this case, the empty dependency array [] means this function will only be created once and reused across re-renders. This can be beneficial when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.
        setEditorContent(content);
    }, []);

    const handleTitle = (event : ChangeEvent<HTMLInputElement>) : void=> {
        setTitle(event.target.value);
    };
  
    return (
        <>
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
            {/* <div>
              {title} <br/>
              {parse(editorcontent)}
            </div> */}
        </div>
      </>
    );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;