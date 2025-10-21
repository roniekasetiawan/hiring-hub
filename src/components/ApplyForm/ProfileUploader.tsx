import React, { useState } from "react";
import { Camera, Upload } from "lucide-react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface ProfileUploaderProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const ProfileUploader = React.forwardRef<
  HTMLInputElement,
  ProfileUploaderProps
>(({ onChange, onBlur, name, error }, ref) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 pt-2">
      <span className="self-start text-sm font-medium text-gray-800 mb-1.5">
        Photo Profile
        <span className="text-red-500 ml-0.5">*</span>
      </span>

      {error && (
        <span className="block self-start text-xs font-medium text-red-500 -mt-2 mb-1">
          Required
        </span>
      )}

      <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border">
        {preview ? (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-20 h-20 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Camera size={16} />
          Take a Picture
        </button>

        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
          <Upload size={16} />
          Choose File
          <input
            type="file"
            accept="image/*"
            className="hidden"
            name={name}
            ref={ref}
            onChange={handleChange}
            onBlur={onBlur}
          />
        </label>
      </div>
    </div>
  );
});

ProfileUploader.displayName = "ProfileUploader";
export default ProfileUploader;
