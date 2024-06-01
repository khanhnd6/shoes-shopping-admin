import { faCloudUploadAlt, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Spinning } from '../../../animation-loading';

const UploadSquare = ({ text, id, width, name, handleImageChange, src , handleRemoveImage, img}) => {
  // const [src, setSrc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const handleShowImage = (e) => {

    //show image
    const fileImg = e.target.files[0];
    if (!fileImg) return;
    handleImageChange(e, fileImg, setLoading); 
  }

  useEffect(() => {
    if(src){
      setLoading(true);
      console.log("contain src", src)
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        setLoading(false);
      };
      reader.readAsDataURL(src);
      
    }
    
  }, [src, setLoading])
  


  return (
    <div className={`${width} aspect-square border-[2px] bg-[#f2f5f8] border-dashed border-bgPrimary rounded-[4px] `}>
      <label
        className='flex flex-col gap-2 items-center justify-center w-full h-full cursor-pointer'
        htmlFor={id}>
        {loading && <Spinning color='#000' size='26px' />}
        {(!src && !img) && !loading &&
          <>
            <FontAwesomeIcon className='text-[26px]' icon={faCloudUploadAlt} />
            <span className='text-[16px]'>{text}</span>
          </>}
        {(src || img) && !loading && 
          <div className={`${width} aspect-square relative overflow-hidden`}>
            <img className='w-full h-full object-cover object-center' src={!!src ? preview : `${process.env.REACT_APP_API_ENDPOINT}${img}`} alt="" />
            <button className='absolute top-0 right-1 z-10' 
              onClick={(e)=>{ 
                handleRemoveImage(e, !!src ? src : img)
              }}
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        }
      </label>
      <input
        onChange={handleShowImage}
        type="file"
        name={name}
        id={id}
        hidden />
    </div>
  );
};
// upload-product
export default UploadSquare;