"use client";

import React, { useState, useEffect } from "react";
import { Camera, Upload } from "lucide-react";
import { FieldError } from "react-hook-form";

interface ProfileUploaderProps {
  value?: File | string | null;
  onChange?: (file: File) => void;
  onTakePicClick: () => void;
  error?: FieldError;
}

const ProfileUploader: React.FC<ProfileUploaderProps> = ({
  value,
  onChange,
  onTakePicClick,
  error,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (value) {
      if (typeof value === "string") {
        setPreview(value);
      } else if (value instanceof File) {
        objectUrl = URL.createObjectURL(value);
        setPreview(objectUrl);
      }
    } else {
      setPreview(null);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [value]);

  return (
    <div className="flex flex-col items-start space-y-4 pt-2">
      <span className="self-start text-sm font-medium text-gray-800 mb-1.5">
        Photo Profile
        <span className="text-red-500 ml-0.5">*</span>
      </span>

      {error && (
        <span className="block self-start text-xs font-medium text-red-500 -mt-2 mb-1">
          {error.message || "Required"}
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
            alt="Default Avatar"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onTakePicClick}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          <Camera size={16} />
          Take A Picture
        </button>
      </div>
    </div>
  );
};

export default ProfileUploader;
