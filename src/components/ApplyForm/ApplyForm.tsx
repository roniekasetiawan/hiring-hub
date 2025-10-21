"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplyFormData, ApplyFormSchema } from "./ApplyFormSchema";
import { ArrowLeft } from "lucide-react";
import base64toFile from "@/utility/base64toFile";

import FormField from "./FormField";
import TextInput from "./TextInput";
import RadioGroup from "./RadioGroup";
import ProfileUploader from "./ProfileUploader";
import DatePicker from "../(input)/DatePicker";
import PhoneNumber from "../(input)/PhoneNumber";
import ProvinceAutoComplete from "../(input)/ProvinceAutoComplete";
import CaptureModal from "@/app/capture/HandCapture";
import Portal from "@/components/Portal";
import { useRouter } from "next/navigation";
import { Job } from "@/modules/OpeningJob/types/job";

interface ApplyFormProps {
  doClose?: () => void;
  job: Job;
}

const ApplyForm: any = ({ doClose, job }: ApplyFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(ApplyFormSchema),
  });

  const [isCaptureOpen, setCaptureOpen] = useState(false);

  const onSubmit: SubmitHandler<ApplyFormData> = async (data) => {
    setIsSubmitting(true);

    const formData = new FormData();

    formData.append("jobId", job.id);
    formData.append("fullName", data.fullName);
    formData.append("dateOfBirth", data.dateOfBirth.toDateString());
    formData.append("pronoun", data.pronoun);
    formData.append("domicile", JSON.stringify(data.domicile));
    formData.append("phoneNumber", JSON.stringify(data.phoneNumber));
    formData.append("email", data.email);
    formData.append("linkedin", data.linkedin);

    if (data.photoProfile) {
      formData.append("photoProfile", data.photoProfile);
    }

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      router.push("/success-apply");
    } catch (error: any) {
      console.error("Submission failed:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoSubmit = (imgData: string) => {
    const file = base64toFile(imgData, "profile-photo.jpg");
    // @ts-ignore
    setValue("photoProfile", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setCaptureOpen(false);
  };

  const pronounOptions = [
    { label: "She/her (Female)", value: "female" },
    { label: "He/him (Male)", value: "male" },
  ];

  return (
    <>
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
            <p onClick={doClose}>x</p>
          </div>
        </div>

        <form
          id="apply-form-main"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 overflow-y-auto p-6 sm:pt-6"
        >
          <Controller
            name="photoProfile"
            control={control}
            render={({ field }) => {
              console.log({ field });
              return (
                <ProfileUploader
                  value={field.value}
                  onChange={field.onChange}
                  onTakePicClick={() => setCaptureOpen(true)}
                  // @ts-ignore
                  error={errors.photoProfile}
                />
              );
            }}
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
            {isSubmitting ? "Submitting" : "Submit"}
          </button>
        </div>
      </div>

      {isCaptureOpen && (
        <Portal>
          <CaptureModal
            onClose={() => setCaptureOpen(false)}
            onSubmit={handlePhotoSubmit}
          />
        </Portal>
      )}
    </>
  );
};

export default ApplyForm;
