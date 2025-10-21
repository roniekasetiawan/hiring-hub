"use client";

import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplyFormData, ApplyFormSchema } from "./ApplyFormSchema";
import { ArrowLeft, Info } from "lucide-react";

import FormField from "./FormField";
import TextInput from "./TextInput";
import RadioGroup from "./RadioGroup";
import ProfileUploader from "./ProfileUploader";
import DatePicker from "../(input)/DatePicker";
import PhoneNumber from "../(input)/PhoneNumber";
import ProvinceAutoComplete from "../(input)/ProvinceAutoComplete";

interface ApplyFormProps {
  doClose?: () => void;
}

const ApplyForm: React.FC = ({ doClose }: ApplyFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(ApplyFormSchema),
  });

  const onSubmit: SubmitHandler<ApplyFormData> = (data) => {
    console.log("Form data:", data);
    alert("Form submitted successfully!");
  };

  const pronounOptions = [
    { label: "She/her (Female)", value: "female" },
    { label: "He/him (Male)", value: "male" },
  ];

  return (
    <div className="w-2xl mx-auto bg-white rounded-lg shadow-xl flex flex-col max-h-[80vh]">
      <div className="flex-shrink-0 p-6 sm:pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={doClose}
            className="text-gray-600 hover:text-gray-900 p-1 -ml-1 hover:cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            Apply Front End at Rakamin
          </h1>
          <div className="w-6"></div>
          <div className="flex items-center gap-2.5 text-sm text-gray-500 p-3">
            <p>ℹ️ This field required to fill</p>
          </div>
        </div>
      </div>

      <form
        id="apply-form-main"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 overflow-y-auto p-6 sm:pt-6"
      >
        <ProfileUploader
          error={errors.photoProfile}
          {...register("photoProfile")}
        />

        <FormField label="Full name" required error={errors.fullName}>
          <TextInput
            placeholder="Enter your full name"
            error={!!errors.fullName}
            {...register("fullName")}
          />
        </FormField>

        <FormField label="Date of birth" required error={errors.dateOfBirth}>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.dateOfBirth}
              />
            )}
          />
        </FormField>

        <FormField label="Pronoun (gender)" required error={errors.pronoun}>
          <Controller
            name="pronoun"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name={field.name}
                options={pronounOptions}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>

        <FormField label="Domicile" required error={errors.domicile}>
          <Controller
            name="domicile"
            control={control}
            render={({ field }) => (
              <ProvinceAutoComplete
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.domicile}
              />
            )}
          />
        </FormField>

        <FormField label="Phone number" required error={errors.phoneNumber}>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <PhoneNumber
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.phoneNumber}
              />
            )}
          />
        </FormField>

        <FormField label="Email" required error={errors.email}>
          <TextInput
            type="email"
            placeholder="Enter your email address"
            error={!!errors.email}
            {...register("email")}
          />
        </FormField>

        <FormField label="Link Linkedin" required error={errors.linkedin}>
          <TextInput
            placeholder="https://www.linkedin.com/in/username"
            error={!!errors.linkedin}
            {...register("linkedin")}
          />
        </FormField>
      </form>

      <div className="flex-shrink-0 p-6 sm:pt-4 border-t border-gray-200">
        <button
          type="submit"
          form="apply-form-main"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold 
                     py-3 px-4 rounded-lg transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ApplyForm;
