import Image from "next/image";
import {
  LISTING_IMAGE_FORMATS_LABEL,
  LISTING_VIDEO_FORMATS_LABEL,
} from '@/constants/listingUploadLimits';
export const InputField = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  maxLength,
  readOnly = false,
  onClick,
  required = true,
}) => (
  <div className="relative flex flex-col justify-start">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      maxLength={maxLength}
      readOnly={readOnly}
      onClick={onClick}
      required={required}
      className={`w-full shadow-neons h-[50px] pl-5 placeholder:text-dark-grey outline-with-opacity placeholder:text-[15px] placeholder:font-normal ${error ? "input-field-error" : ""
        }`}
    />
    {error && (
      <span className="text-red-500 text-sm font-medium absolute top-[50px]">
        **{error}
      </span>
    )}
  </div>
);

// Reusable File Upload Component
export const FileUpload = ({
  id,
  accept,
  value,
  placeholder,
  onChange,
  error,
  isVideo = false,
  handleFileRemove,
}) => {
  // Check if the value is a valid file or blob
  const filePreview = value instanceof Blob ? URL.createObjectURL(value) : null;

  return (
    <div
      className={`relative w-full dropdown-container ${error ? "border-red-500 border" : "shadow-neons"
        } h-[191px] px-[20px] pt-[13px]`}
    >
      <h2 className="text-dark-grey text-[15px] font-normal leading-[26px]">
        Accepted formats:
      </h2>
      <p className="text-dark-grey text-[10px] font-normal leading-[177%]">
        {isVideo ? LISTING_VIDEO_FORMATS_LABEL : LISTING_IMAGE_FORMATS_LABEL}
      </p>

      <input
        type="file"
        id={id}
        className="hidden"
        accept={accept}
        onChange={onChange}
        multiple={!isVideo}
      />

      <div className="absolute right-[20px] xl:top-0 xxs:top-[55px]">
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center w-[176px] xl:h-[154px] xxs:h-[110px] shadow-neonsm cursor-pointer my-[19px]"
        >
          <Image
            width={45}
            height={45}
            src="/listing/camera.svg"
            alt="Upload Image"
          />
          <span className="text-[17px] text-dark-grey font-normal pt-[18px]">
            {placeholder}
          </span>
        </label>
      </div>

      {filePreview && (
        <div className="relative mt-2">
          {isVideo ? (
            <video
              width="100%"
              controls
              src={filePreview}
              className="w-full h-auto"
            />
          ) : (
            <Image
              width={20}
              height={20}
              src={filePreview}
              alt="uploaded-image"
              className="w-full h-auto"
            />
          )}
          <button
            onClick={handleFileRemove}
            className="absolute top-0 right-0 w-6 flex justify-center items-center h-6 p-1 bg-light-gold text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove file"
          >
            &times;
          </button>
        </div>
      )}

      {error && (
        <span className="text-red-500 text-sm font-medium absolute top-[99%]">
          **{error}
        </span>
      )}
    </div>
  );
};
