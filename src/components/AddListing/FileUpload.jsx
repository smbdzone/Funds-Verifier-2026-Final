import { React, useRef } from "react";
import Image from "next/image";
const FileUpload = ({
  type,
  label,
  acceptedFormats,
  maxSize,
  files,
  errors,
  onFileChange,
  onFileRemove,
}) => {
  const fileInputRef = useRef(null);

  return (
    <div
      className={`${errors[type] ? "border-red-500 border" : "shadow-neons"
        } h-[191px] relative px-[20px] pt-[13px] overflow-hidden ${type === "video" ? "row-span-2" : ""
        }`}
    >
      <h2 className="text-dark-grey text-[15px] font-normal leading-[26px]">
        Accepted formats:
      </h2>
      <p className="text-dark-grey text-[10px] font-normal leading-[177%]">
        {acceptedFormats}. Maximum file size: {maxSize}
      </p>

      <div className="flex flex-wrap mt-2 w-[70%] overflow-y-auto h-full">
        {/* Display all pictures in the array */}
        {type === "pictures" &&
          Array.isArray(files) &&
          files.length > 0 &&
          files.map((file, index) => {
            if (file instanceof File || file instanceof Blob) {
              return (
                <div className="w-fit p-2 relative group" key={index}>
                  <Image
                    width={100}
                    height={100}
                    src={URL.createObjectURL(file)}
                    alt={`upload-${type}-${index}`}
                  />
                  <button
                    onClick={() => onFileRemove(type, index)}
                    className="absolute top-0 right-0 w-6 flex justify-center items-center h-6 p-1 bg-light-gold text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove"
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              );
            }
            return null;
          })}

        {/* Display thumbnail or video as a single file */}
        {type !== "pictures" &&
          files &&
          (files instanceof File || files instanceof Blob) && (
            <div className="fit h-full overflow-hidden p-2 relative group">
              {type === "video" ? (
                <video width="100" controls src={URL.createObjectURL(files)} />
              ) : (
                <Image
                  width={150}
                  height={100}
                  src={URL.createObjectURL(files)}
                  alt={`upload-${type}`}
                />
              )}
              <button
                onClick={() => onFileRemove(type)}
                type="button"
                className="absolute top-0 right-0 w-6 flex justify-center items-center h-6 p-1 bg-light-gold text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                &times;
              </button>
            </div>
          )}

        <input
          type="file"
          id={`${type}-upload`}
          className="hidden"
          accept={type === "video" ? "video/*" : "image/*"}
          multiple={type === "pictures"}
          ref={fileInputRef}
          onChange={onFileChange}
        />

        <div className="absolute right-[20px] xl:top-0 xxs:top-[55px]">
          <label
            htmlFor={`${type}-upload`}
            className="flex flex-col items-center justify-center w-[176px] xl:h-[154px] xxs:h-[110px] shadow-neonsm cursor-pointer my-[19px]"
          >
            <Image
              width={45}
              height={45}
              src={
                type === "video" ? "/listing/video.svg" : "/listing/camera.svg"
              }
              alt={`Upload ${label}`}
            />
            <span className="text-[17px] text-dark-grey font-normal pt-[18px]">
              Add {label}
            </span>
          </label>
        </div>
      </div>

      {errors[type] && (
        <span className="text-red-500 text-sm -ml-4 font-medium absolute top-[99%]">
          **{errors[type]}
        </span>
      )}
    </div>
  );
};

export default FileUpload;
