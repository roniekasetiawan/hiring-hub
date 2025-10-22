"use client";

import React, { useMemo, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  buildApplyFormSchema,
  normalizeApplicationsConfig,
  type ApplyFormData,
  type ApplicationsConfigAPI,
} from "./ApplyFormSchema";
import { ArrowLeft } from "lucide-react";
import FormField from "./FormField";
import TextInput from "./TextInput";
import RadioGroup from "./RadioGroup";
import DatePicker from "../(input)/DatePicker";
import PhoneNumber from "../(input)/PhoneNumber";
import ProvinceAutoComplete from "../(input)/ProvinceAutoComplete";
import CaptureModal from "@/app/capture/HandCapture";
import Portal from "@/components/Portal";
import { useRouter } from "next/navigation";
import { Job } from "@/modules/OpeningJob/types/job";
import ProfileUploader from "@/components/ApplyForm/ProfileUploader";
import base64toFile from "@/utility/base64toFile";

interface ApplyFormProps {
  doClose?: () => void;
  job: Job;
}

const ApplyForm: any = ({ doClose, job }: ApplyFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldMode = useMemo(
    () =>
      normalizeApplicationsConfig(
        (job as any)?.applications_config as ApplicationsConfigAPI,
      ),
    [job],
  );
  const dynamicSchema = useMemo(
    () =>
      buildApplyFormSchema(
        (job as any)?.applications_config as ApplicationsConfigAPI,
      ),
    [job],
  );

  const defaultValues = useMemo(
    () => ({
      photoProfile: undefined as File | undefined,
      fullName: "",
      dateOfBirth: undefined as Date | undefined,
      pronoun: undefined as "female" | "male" | undefined,
      domicile: null as any,
      phoneNumber: null as any,
      email: "",
      linkedin: "",
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(dynamicSchema),
    defaultValues,
  });

  const isOff = (k: keyof typeof fieldMode) => fieldMode[k] === "Off";
  const isRequired = (k: keyof typeof fieldMode) =>
    fieldMode[k] === "Mandatory";
  const [isCaptureOpen, setCaptureOpen] = useState(false);

  const onSubmit: SubmitHandler<ApplyFormData> = async (data) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("jobId", job.id || "");
    formData.append("fullName", (data as any).fullName ?? "");
    formData.append(
      "dateOfBirth",
      (data as any).dateOfBirth ? (data as any).dateOfBirth.toDateString() : "",
    );
    formData.append("pronoun", (data as any).pronoun ?? "");
    formData.append(
      "domicile",
      (data as any).domicile ? JSON.stringify((data as any).domicile) : "",
    );
    formData.append(
      "phoneNumber",
      (data as any).phoneNumber
        ? JSON.stringify((data as any).phoneNumber)
        : "",
    );
    formData.append("email", (data as any).email ?? "");
    formData.append("linkedin", (data as any).linkedin ?? "");
    if ((data as any).photoProfile) {
      formData.append("photoProfile", (data as any).photoProfile as File);
    }

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Failed to submit application");
      }
      router.push("/success-apply");
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoSubmit = (imgData: string) => {
    const file = base64toFile(imgData, "profile-photo.jpg");
    // @ts-ignore
    setValue("photoProfile", file, { shouldValidate: true, shouldDirty: true });
    setCaptureOpen(false);
  };

  const pronounOptions = [
    { label: "She/her (Female)", value: "female" },
    { label: "He/him (Male)", value: "male" },
  ];

  return (
    <>
      <div className="mx-auto w-full max-w-[92vw] sm:max-w-2xl md:max-w-3xl mt-15 lg:max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] md:max-h-[80vh]">
        <div className="flex-shrink-0 border-b border-gray-200 p-4 sm:p-6">
          <div className="mb-2 flex flex-col items-start justify-between gap-3 sm:mb-4 sm:flex-row sm:items-center">
            <button
              onClick={doClose}
              className="text-gray-600 hover:text-gray-900 p-1 hover:cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft size={24} />
            </button>

            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-left sm:text-center">
              Apply {job.title} {job.company_name ? "at" : ""}{" "}
              {job.company_name}
            </h1>

            <div className="w-6 sm:w-8" />
          </div>

          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-500 p-2 sm:p-3">
            <p>ℹ️ This field required to fill</p>
          </div>
        </div>

        <form
          id="apply-form-main"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {!isOff("photoProfile") && (
            <div className="sm:col-span-2">
              <Controller
                name="photoProfile"
                control={control}
                render={({ field }) => (
                  <ProfileUploader
                    value={field.value as any}
                    onChange={field.onChange}
                    onTakePicClick={() => setCaptureOpen(true)}
                    error={(errors as any).photoProfile}
                  />
                )}
              />
            </div>
          )}

          {!isOff("fullName") && (
            <div className="sm:col-span-2">
              <FormField
                label="Full name"
                required={isRequired("fullName")}
                error={(errors as any).fullName}
              >
                <TextInput
                  placeholder="Enter your full name"
                  error={!!(errors as any).fullName}
                  {...register("fullName" as any)}
                />
              </FormField>
            </div>
          )}

          {!isOff("dateOfBirth") && (
            <FormField
              label="Date of birth"
              required={isRequired("dateOfBirth")}
              error={(errors as any).dateOfBirth}
            >
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={(errors as any).dateOfBirth}
                  />
                )}
              />
            </FormField>
          )}

          {!isOff("pronoun") && (
            <FormField
              label="Pronoun (gender)"
              required={isRequired("pronoun")}
              error={(errors as any).pronoun}
            >
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
          )}

          {!isOff("domicile") && (
            <div className="sm:col-span-2">
              <FormField
                label="Domicile"
                required={isRequired("domicile")}
                error={(errors as any).domicile}
              >
                <Controller
                  name="domicile"
                  control={control}
                  render={({ field }) => (
                    <ProvinceAutoComplete
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={(errors as any).domicile}
                    />
                  )}
                />
              </FormField>
            </div>
          )}

          {!isOff("phoneNumber") && (
            <FormField
              label="Phone number"
              required={isRequired("phoneNumber")}
              error={(errors as any).phoneNumber}
            >
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <PhoneNumber
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={(errors as any).phoneNumber}
                  />
                )}
              />
            </FormField>
          )}

          {!isOff("email") && (
            <FormField
              label="Email"
              required={isRequired("email")}
              error={(errors as any).email}
            >
              <TextInput
                type="email"
                placeholder="Enter your email address"
                error={!!(errors as any).email}
                {...register("email" as any)}
              />
            </FormField>
          )}

          {!isOff("linkedin") && (
            <div className="sm:col-span-2">
              <FormField
                label="Link Linkedin"
                required={isRequired("linkedin")}
                error={(errors as any).linkedin}
              >
                <TextInput
                  placeholder="https://www.linkedin.com/in/username"
                  error={!!(errors as any).linkedin}
                  {...register("linkedin" as any)}
                />
              </FormField>
            </div>
          )}
        </form>

        <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4 sm:p-6">
          <button
            type="submit"
            form="apply-form-main"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
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
