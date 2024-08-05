"use client";

import { useState } from "react";
import ReactImageUploading, { ImageListType } from "react-images-uploading";
import Image from 'next/image'; 

export default function ImageUploader({onImageChange}:any) {
  const [images, setImages] = useState([]);
  const maxNumber = 1;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
    onImageChange(imageList[0].file);
  };
  return (
    <div>
      <ReactImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <>
            {imageList.length === 0 && (
              <button
                className="text-gray-400 bg-gray-200 rounded-lg flex flex-col h-52 w-72 justify-center items-center mb-4"
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Upload or Drop your cover image here
              </button>
            )}
            <div>
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <Image
                    src={image.dataURL||''}
                    alt=""
                    width="100"
                    height={100}
                    className="rounded-md"
                  />
                  <div className="image-item__btn-wrapper space-x-4">
                    <button onClick={() => onImageUpdate(index)}>Update</button>
                    <button onClick={() => onImageRemove(index)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </ReactImageUploading>
    </div>
  );
}
