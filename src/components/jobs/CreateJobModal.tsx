import React, {
  useState,
  useEffect,
  useRef,
  FC,
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type Option = "Mandatory" | "Optional" | "Off";

interface CustomSelectProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

type BaseFormFieldProps = {
  id: string;
  label: string;
  prefix?: string;
};

type InputFormFieldProps = BaseFormFieldProps &
  InputHTMLAttributes<HTMLInputElement> & {
    type: "text" | "number";
  };

type TextareaFormFieldProps = BaseFormFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    type: "textarea";
  };

type FormFieldProps = InputFormFieldProps | TextareaFormFieldProps;

interface RequirementToggleProps {
  label: string;
  disabledOptions?: Option[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer: ReactNode;
}

interface JobOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JobRequirement {
  label: string;
  disabled: Option[];
}

const CustomSelect: FC<CustomSelectProps> = ({
  label,
  options,
  selected,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full cursor-default rounded-md border border-gray-200 bg-white py-2 pl-3 pr-10 text-left text-sm"
        >
          <span className="block truncate text-gray-600">
            {selected || "Select job type"}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className={`h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
        {isOpen && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="relative cursor-default select-none py-2 pl-3 pr-9 text-black hover:bg-teal-50"
              >
                <span className="block truncate">{option}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const FormField: FC<FormFieldProps> = (props) => {
  const { id, label, type, prefix } = props;

  const commonClasses =
    "w-full border-1 rounded-md bg-transparent p-2 border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0";
  const withPrefixClasses = "pl-9";

  const renderInput = () => {
    if (type === "textarea") {
      const { id, className, ...rest } = props as TextareaFormFieldProps;
      return (
        <textarea
          id={id}
          className={`${commonClasses} ${className || ""}`}
          {...rest}
        />
      );
    }

    const {
      id,
      className,
      type: inputType,
      ...rest
    } = props as InputFormFieldProps;

    return (
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-semibold text-black">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={inputType}
          className={`${commonClasses} ${prefix ? withPrefixClasses : ""} ${className || ""}`}
          {...rest}
        />
      </div>
    );
  };

  return (
    <div className="pb-2 pt-1">
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-medium text-gray-500"
      >
        {label}
      </label>
      {renderInput()}
    </div>
  );
};

const RequirementToggle: FC<RequirementToggleProps> = ({
  label,
  disabledOptions = [],
}) => {
  const [selection, setSelection] = useState<Option>("Mandatory");
  const options: Option[] = ["Mandatory", "Optional", "Off"];

  const getButtonClass = (option: Option): string => {
    const baseClass =
      "rounded-full px-3 py-1 text-xs font-medium transition border border-gray-200 hover:cursor-pointer duration-150 ease-in-out";
    const isDisabled = disabledOptions.includes(option);

    if (isDisabled) {
      return `${baseClass} bg-gray-100 text-gray-400 cursor-not-allowed hover:cursor-not-allowed`;
    }
    if (option === selection) {
      return `${baseClass} bg-white border border-teal-400 text-teal-600 shadow-sm`;
    }
    return `${baseClass} text-gray-500 hover:bg-gray-100`;
  };

  return (
    <div className="flex items-center justify-between p-4">
      <p className="text-sm text-gray-700">{label}</p>
      <div className="flex items-center space-x-2">
        {options.map((option) => {
          const isDisabled = disabledOptions.includes(option);
          return (
            <button
              key={option}
              onClick={() => !isDisabled && setSelection(option)}
              className={getButtonClass(option)}
              disabled={isDisabled}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 pt-10"
      onClick={onClose}
    >
      <div
        className="relative mx-4 mb-10 flex w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
        <div className="flex items-center justify-end space-x-3 border-t border-gray-200 p-4">
          {footer}
        </div>
      </div>
    </div>
  );
};

const JobOpeningModal: FC<JobOpeningModalProps> = ({ isOpen, onClose }) => {
  const [jobType, setJobType] = useState<string>("Full-time");
  const jobTypeOptions: string[] = [
    "Full-time",
    "Contract",
    "Part-time",
    "Internship",
    "Freelance",
  ];

  const jobRequirements: JobRequirement[] = [
    { label: "Full Name", disabled: ["Optional", "Off"] },
    { label: "Photo Profile", disabled: ["Optional", "Off"] },
    { label: "Gender", disabled: [] },
    { label: "Domicile", disabled: [] },
    { label: "Email", disabled: ["Optional", "Off"] },
    { label: "Phone number", disabled: [] },
    { label: "LinkedIn link", disabled: [] },
    { label: "Date of Birth", disabled: [] },
  ];

  const handleSubmit = () => {
    console.log("Job Published!");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Job Opening"
      footer={
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Publish Job
        </button>
      }
    >
      <div className="space-y-6">
        <FormField
          label="Job Name*"
          id="jobName"
          type="text"
          placeholder="Front End Developer"
        />
        <CustomSelect
          label="Job Type*"
          options={jobTypeOptions}
          selected={jobType}
          onSelect={setJobType}
        />
        <FormField
          label="Job Description*"
          id="jobDescription"
          type="textarea"
          rows={8}
          placeholder="• Develop, test, and maintain responsive web applications..."
        />
        <FormField
          label="Number of Candidate Needed*"
          id="numCandidates"
          type="number"
          placeholder="1"
        />
        <div className="border-t border-gray-300 border-dashed mb-3"></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            label="Minimum Estimated Salary"
            id="minSalary"
            type="text"
            placeholder="7.000.000"
            prefix="Rp"
          />
          <FormField
            label="Maximum Estimated Salary"
            id="maxSalary"
            type="text"
            placeholder="8.000.000"
            prefix="Rp"
          />
        </div>
        <div className="border border-gray-200 p-5 rounded-lg">
          <h4 className="mb-4 font-semibold text-gray-800">
            Minimum Profile Information Required
          </h4>
          <div>
            {jobRequirements.map((req, index) => (
              <div
                key={req.label}
                className={
                  index < jobRequirements.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }
              >
                <RequirementToggle
                  label={req.label}
                  disabledOptions={req.disabled}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default JobOpeningModal;
