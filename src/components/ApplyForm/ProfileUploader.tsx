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
    <div className="flex flex-col items-start space-y-4 pt-2">
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
          <img
            src={"/assets/images/default_avatar.png"}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
          <Camera size={16} />
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
