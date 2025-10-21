import React from "react";

type RadioOption = {
  label: string;
  value: string;
};

interface RadioGroupProps {
  options: RadioOption[];
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  name,
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <div className="flex gap-6 items-center pt-1">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
          />
          <span className="text-sm text-gray-800">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
