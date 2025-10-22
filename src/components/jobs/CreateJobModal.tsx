"use client";

import React, {
  useState,
  useEffect,
  useRef,
  FC,
  ReactNode,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@mui/material";
import Swal from "sweetalert2";

type Option = "Mandatory" | "Optional" | "Off";

export const jobOpeningSchema = z.object({
  jobName: z.string().min(1, "Job name is required"),
  jobType: z.enum(
    ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
    { error: "Job type is required" },
  ),
  numCandidates: z.coerce
    .number({ error: "Must be a number" })
    .int()
    .min(1, "At least 1 candidate is needed"),
  requirements: z.record(z.string(), z.enum(["Mandatory", "Optional", "Off"])),
  jobDescription: z.string().min(1, "Job description is required"),
  minSalary: z.string().min(1, "Minimum salary is required"),
  maxSalary: z.string().min(1, "Maximum salary is required"),
});

export type JobOpeningFormValues = z.infer<typeof jobOpeningSchema>;

interface CustomSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

type BaseFormFieldProps = {
  label: string;
  prefix?: string;
  error?: string;
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
  value: Option;
  onChange: (value: Option) => void;
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
  key: string;
  disabled: Option[];
}

const CustomSelect: FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-10 text-left text-sm ${error ? "border-red-500" : "border-gray-200"}`}
        >
          <span className="block truncate text-gray-600">
            {value || "Select job type"}
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
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="relative cursor-default select-none py-2 pl-3 pr-9 text-black hover:bg-teal-50"
              >
                <span className="block truncate">{option}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const FormField: FC<FormFieldProps> = ({ label, prefix, error, ...rest }) => {
  const commonClasses =
    "w-full border-1 rounded-md bg-transparent p-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1";
  const withPrefixClasses = "pl-9";
  const errorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const defaultClasses =
    "border-gray-200 focus:ring-teal-500 focus:border-teal-500";

  const allProps = { ...rest };

  return (
    <div className="pb-2 pt-1">
      <label
        htmlFor={allProps.name}
        className="mb-1 block text-xs font-medium text-gray-500"
      >
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-semibold text-black">
            {prefix}
          </span>
        )}
        {allProps.type === "textarea" ? (
          <textarea
            className={`${commonClasses} ${error ? errorClasses : defaultClasses}`}
            {...(allProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={`${commonClasses} ${prefix ? withPrefixClasses : ""} ${error ? errorClasses : defaultClasses}`}
            {...(allProps as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const RequirementToggle: FC<RequirementToggleProps> = ({
  label,
  disabledOptions = [],
  value,
  onChange,
}) => {
  const options: Option[] = ["Mandatory", "Optional", "Off"];

  const getButtonClass = (option: Option): string => {
    const baseClass =
      "rounded-full px-3 py-1 text-xs font-medium transition border border-gray-200 hover:cursor-pointer duration-150 ease-in-out";
    if (disabledOptions.includes(option)) {
      return `${baseClass} bg-gray-100 text-gray-400 cursor-not-allowed`;
    }
    if (option === value) {
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
              type="button"
              onClick={() => !isDisabled && onChange(option)}
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
      className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/60 pt-10"
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
  const [apiError, setApiError] = useState<string | null>(null);
  const jobTypeOptions: string[] = [
    "Full-time",
    "Contract",
    "Part-time",
    "Internship",
    "Freelance",
  ];

  const jobRequirements: JobRequirement[] = [
    { label: "Full Name", key: "fullName", disabled: ["Optional", "Off"] },
    {
      label: "Photo Profile",
      key: "photoProfile",
      disabled: ["Optional", "Off"],
    },
    { label: "Gender", key: "gender", disabled: [] },
    { label: "Domicile", key: "domicile", disabled: [] },
    { label: "Email", key: "email", disabled: ["Optional", "Off"] },
    { label: "Phone number", key: "phoneNumber", disabled: [] },
    { label: "LinkedIn link", key: "linkedinLink", disabled: [] },
    { label: "Date of Birth", key: "dateOfBirth", disabled: [] },
  ];

  const defaultRequirements = Object.fromEntries(
    jobRequirements.map((req) => [
      req.key,
      req.disabled.length > 0 ? "Mandatory" : "Optional",
    ]),
  ) as Record<string, Option>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JobOpeningFormValues>({
    resolver: zodResolver(jobOpeningSchema) as any,
    defaultValues: {
      jobName: "",
      jobType: "Full-time",
      numCandidates: 1,
      requirements: defaultRequirements,
      jobDescription: "",
      minSalary: "",
      maxSalary: "",
    },
  });

  const onSubmit: SubmitHandler<JobOpeningFormValues> = async (data) => {
    setApiError(null);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "An unknown error occurred");
      }

      Swal.fire({
        title: "Success!",
        text: "Job opening created successfully!",
        icon: "success",
        confirmButtonText: "Great!",
      });
      reset();
      onClose();
    } catch (error: any) {
      setApiError(error.message);
      console.error("Failed to create job opening:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Job Opening"
      footer={
        <button
          type="submit"
          form="job-opening-form"
          disabled={isSubmitting}
          className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
        >
          {isSubmitting ? "Publishing..." : "Publish Job"}
        </button>
      }
    >
      <form
        id="job-opening-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {apiError && <Alert severity="error">{apiError}</Alert>}

        <FormField
          label="Job Name*"
          type="text"
          placeholder="Front End Developer"
          error={errors.jobName?.message}
          {...register("jobName")}
        />

        <Controller
          name="jobType"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label="Job Type*"
              options={jobTypeOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.jobType?.message}
            />
          )}
        />

        <FormField
          label="Job Description*"
          type="textarea"
          rows={8}
          placeholder="• Develop, test, and maintain responsive web applications..."
          error={errors.jobDescription?.message}
          {...register("jobDescription")}
        />

        <FormField
          label="Number of Candidate Needed*"
          type="number"
          placeholder="1"
          error={errors.numCandidates?.message}
          {...register("numCandidates")}
        />

        <div className="border-t border-gray-300 border-dashed mb-3"></div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            label="Minimum Estimated Salary"
            type="text"
            placeholder="7.000.000"
            prefix="Rp"
            error={errors.minSalary?.message}
            {...register("minSalary")}
          />
          <FormField
            label="Maximum Estimated Salary"
            type="text"
            placeholder="8.000.000"
            prefix="Rp"
            error={errors.maxSalary?.message}
            {...register("maxSalary")}
          />
        </div>

        <div className="border border-gray-200 p-5 rounded-lg">
          <h4 className="mb-4 font-semibold text-gray-800">
            Minimum Profile Information Required
          </h4>
          <div>
            {jobRequirements.map((req, index) => (
              <div
                key={req.key}
                className={
                  index < jobRequirements.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }
              >
                <Controller
                  name={`requirements.${req.key}` as any}
                  control={control}
                  render={({ field }) => (
                    <RequirementToggle
                      label={req.label}
                      disabledOptions={req.disabled}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default JobOpeningModal;
