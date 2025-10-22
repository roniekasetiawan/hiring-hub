import React, { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, className, ...props }, ref) => {
    const errorClasses = error
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-teal-500";

    return (
      <input
        {...props}
        ref={ref}
        className={`w-full px-4 py-2.5 border rounded-lg text-black 
                    focus:outline-none focus:ring-2 focus:border-transparent
                    placeholder:text-gray-400
                    ${errorClasses} ${className}`}
      />
    );
  },
);

TextInput.displayName = "TextInput";
export default TextInput;
