import { z } from "zod";
import { File as NodeFile } from "undici";
const FileCtor: any = (globalThis as any).File ?? NodeFile;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ProvinceSchema = z.object({
  value: z.string().min(1, "Required"),
  label: z.string(),
});

const PhoneSchema = z.object({
  country: z.any(),
  national: z.string().min(1, "Required"),
});

export const ApplyFormSchema = z.object({
  photoProfile: z
    .instanceof(FileCtor, { message: "Required" })
    .refine((f) => f.size <= MAX_FILE_SIZE, "Max 5MB")
    .refine((f) => ACCEPTED_IMAGE_TYPES.includes(f.type), "Only jpg/png/webp"),
  fullName: z.string().min(1, "Required"),
  dateOfBirth: z.date({
    error: "Required",
  }),
  pronoun: z.enum(["female", "male"], { error: "Required" }),
  domicile: ProvinceSchema.nullable().refine((val) => val, {
    message: "Required",
  }),

  phoneNumber: PhoneSchema.nullable().refine(
    (val) => val && val.national.length > 0,
    { message: "Required" },
  ),
  email: z
    .string()
    .min(1, "Required")
    .email("Please enter your email in the format: name@example.com"),
  linkedin: z
    .string()
    .min(1, "Required")
    .url(
      "Please copy paste your Linkedin URL, example: https://www.linkedin.com/in/username",
    ),
});

export type ApplyFormData = z.infer<typeof ApplyFormSchema>;
