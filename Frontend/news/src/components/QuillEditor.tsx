// 'use client'
// import dynamic from 'next/dynamic';
// import React, { useState, useCallback, memo, ChangeEvent } from 'react';
// import 'react-quill/dist/quill.snow.css';
// import { ReactQuillProps } from 'react-quill';
// import ImageUploader from './ImageUploader';

// const QuillNoSSRWrapper = dynamic<ReactQuillProps>(() => import('react-quill'), {
//     ssr: false,
//     loading: () => <p>Loading ...</p>,
// });

// const modules = { //Also move these outside
//     toolbar: [
//         [{ header: '1' }, { header: '2' }, { font: [] }],
//         [{ size: [] }],
//         ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//         [
//             { list: 'ordered' },
//             { list: 'bullet' },
//             { indent: '-1' },
//             { indent: '+1' },
//         ],
//         ['link', 'image', 'video'],
//         ['clean'],
//     ],
//     clipboard: {
//         matchVisual: false,
//     },
// };

// const formats = [
//     'header',
//     'font',
//     'size',
//     'bold',
//     'italic',
//     'underline',
//     'strike',
//     'blockquote',
//     'list',
//     'bullet',
//     'indent',
//     'link',
//     'image',
//     'video',
// ];

// const QuillEditor : React.FC = memo(() => {
//     const saveNews = async (e : any) => {
//         e.preventDefault();
//         if (!title || !editorcontent)
//         {
//           alert("Please fill all details !");
//           return
//         }
//         // console.log(title, editorcontent);
//         const formData = new FormData();
//         formData.append('Title', title);
//         formData.append('EditorContent', editorcontent);
//         if(coverImage){
//           formData.append('CoverImage', coverImage);
//         }
//         try{
//           const response = await fetch('/api/newsletter',{
//             method: 'POST',
//             body: formData,
//           });
//           if(!response.ok){
//             throw new Error('Network response was not okay');
//           }
//           const data = await response.json();
//           console.log("Newsletter created with id: ", data);          
//         }
//         catch(error){
//           console.error("Error creating newsletter",error);
//         }
//       } 
//     const [editorcontent, setEditorContent] = useState<string>('');
//     const [title, setTitle] = useState<string>('');
//     const [coverImage, setCoverImage] = useState<File|null>(null);

//     const handleChange = useCallback((content : string) => { //setCallback is a hook that returns a memoized version of the callback function. It only changes if one of the dependencies has changed. In this case, the empty dependency array [] means this function will only be created once and reused across re-renders. This can be beneficial when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders.
//         setEditorContent(content);
//     }, []);

//     const handleTitle = (event : ChangeEvent<HTMLInputElement>) : void=> {
//         setTitle(event.target.value);
//     };

//     const handleImageChange = (file : File|null) => {
//       setCoverImage(file);
//     };
  
//     return (
//         <>
//         <ImageUploader onImageChange = {handleImageChange}/>
//         <input 
//           type="text" 
//           className = "border-none focus:outline-none  focus:border-none p-2 w-full" 
//           value = {title}
//           onChange = {handleTitle}
//           placeholder="Enter Title" 
//         />
//         <div>
//             <QuillNoSSRWrapper 
//                 modules={modules} 
//                 formats={formats} 
//                 placeholder='Enter Article'
//                 value={editorcontent} 
//                 onChange={handleChange} 
//                 theme="snow" 
//             />
//             <button onClick = {saveNews}>Post</button>
//         </div>
//       </>
//     );
// });

// QuillEditor.displayName = 'QuillEditor';

// export default QuillEditor;

'use client'
import dynamic from 'next/dynamic';
import React, { useState, useCallback, memo, ChangeEvent, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import { ReactQuillProps } from 'react-quill';
import ImageUploader from './ImageUploader';
import { supabase } from '@/app/api/auth/[...nextauth]/route';

const QuillNoSSRWrapper = dynamic<ReactQuillProps>(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});

// interface News {
//   id: string;
//   title: string;
//   editorcontent: string;
// } 

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

interface QuillEditorProps {
  initialContent?: string;
  initialTitle?: string; 
  onSave?: (title: string, content: string) => void;
}

const QuillEditor : React.FC<QuillEditorProps> = memo(({ initialContent = '', initialTitle = '', onSave }) => {
  // const [rejected, setRejected] = useState<News[]>([]);
  // const fetchRejected = async () => {
  //   const { data, error } = await supabase
  //       .from('NewsTest')
  //       .select('id, title, editorcontent')
  //       .eq('is_verified', false)
  //       .eq('is_rejected', true);

  //   if (error) {
  //     console.log(error);
  //   } else {
  //     setRejected(data);
  //   }
  // };

  // const handleEdit = (id : string) => {
  //   const edit = rejected.find(edit => edit.id == id)?.editorcontent || '';
  //   setEditorContent(edit);
  // }

  // useEffect(() => {
  //   fetchRejected();
  // }, []);

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
    const [editorcontent, setEditorContent] = useState<string>(initialContent);
    const [title, setTitle] = useState<string>(initialTitle);
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
        {/* <div className="p-8 bg-gray-100 min-h-screen text-center">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Rejected Articles : </h2>
        {rejected.map((unv) => (
          <div key={unv.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{unv.title}</h2>
            <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors" onClick={() => handleEdit(unv.id)}>
                Click to Edit
              </button>
            </div>))}
      </div> */}
      </>
    );
});

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;