'use client'
import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

 
export default function QuillEditor() {
  const [content, setContent] = useState<string>('');
  const quillRef = useRef(null);
 
  const handleChange = (value:any) => {
    setContent(value);
  };
 
  const modules = {
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
 
  return (
<div>
<ReactQuill
        ref={quillRef}
        value={content}
        onChange={handleChange}
        modules={modules}
      />
    <button
    onClick={() => {console.log(content)}
    }
    >loggggg</button>
</div>
  );
}