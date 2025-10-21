import React from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  children,
  className = "",
  error,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-800 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {error && error.message === "Required" && (
        <span className="block text-xs font-medium text-red-500 mb-1">
          Required
        </span>
      )}

      {children}

      {error && error.message !== "Required" && (
        <p className="mt-1.5 text-xs text-red-500">
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default FormField;
