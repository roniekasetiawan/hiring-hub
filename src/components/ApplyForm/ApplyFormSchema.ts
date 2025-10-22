import { z } from "zod";
const isFileLike = (v: unknown): v is { size: number; type: string } =>
  !!v &&
  typeof v === "object" &&
  "size" in v &&
  typeof (v as any).size === "number" &&
  "type" in v &&
  typeof (v as any).type === "string";

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

type FieldMode = "Mandatory" | "Optional" | "Off";

export type ApplicationsConfigAPI = {
  email?: FieldMode;
  gender?: FieldMode;
  domicile?: FieldMode;
  fullName?: FieldMode;
  dateOfBirth?: FieldMode;
  phoneNumber?: FieldMode;
  linkedinLink?: FieldMode;
  photoProfile?: FieldMode;
};

export const normalizeApplicationsConfig = (cfg?: ApplicationsConfigAPI) => {
  const def: FieldMode = "Optional";
  return {
    photoProfile: cfg?.photoProfile ?? def,
    fullName: cfg?.fullName ?? def,
    dateOfBirth: cfg?.dateOfBirth ?? def,
    pronoun: cfg?.gender ?? def,
    domicile: cfg?.domicile ?? def,
    phoneNumber: cfg?.phoneNumber ?? def,
    email: cfg?.email ?? def,
    linkedin: cfg?.linkedinLink ?? (cfg as any)?.linkedin ?? def,
  } as Record<
    | "photoProfile"
    | "fullName"
    | "dateOfBirth"
    | "pronoun"
    | "domicile"
    | "phoneNumber"
    | "email"
    | "linkedin",
    FieldMode
  >;
};

export const buildApplyFormSchema = (cfg?: ApplicationsConfigAPI) => {
  const mode = normalizeApplicationsConfig(cfg);
  const opt = <T extends z.ZodTypeAny>(schema: T, m: FieldMode) =>
    m === "Mandatory" ? schema : schema.optional();

  const domicileMandatory = ProvinceSchema.nullable().refine((val) => val, {
    message: "Required",
  });
  const domicileOptional = ProvinceSchema.nullable().optional();

  const phoneMandatory = PhoneSchema.nullable().refine(
    (val) => val && val.national.length > 0,
    { message: "Required" },
  );
  const phoneOptional = PhoneSchema.nullable().optional();

  const photoNameMandatory = z.string().min(1, "Required");
  const photoNameOptional = photoNameMandatory.optional();

  const a = z
    .custom<File>(isFileLike, { message: "Required" })
    .refine((f) => f.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(
      (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    );

  return z.object({
    photoProfile: z
      .custom<File>(isFileLike, { message: "Required" })
      .refine((f) => f.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
      .refine(
        (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported.",
      ),
    fullName: opt(z.string().min(1, "Required"), mode.fullName),
    dateOfBirth: opt(z.date({ error: "Required" }), mode.dateOfBirth),
    pronoun: opt(
      z.enum(["female", "male"], { error: "Required" }),
      mode.pronoun,
    ),
    domicile:
      mode.domicile === "Mandatory" ? domicileMandatory : domicileOptional,
    phoneNumber:
      mode.phoneNumber === "Mandatory" ? phoneMandatory : phoneOptional,
    email: opt(
      z
        .string()
        .min(1, "Required")
        .email("Please enter your email in the format: name@example.com"),
      mode.email,
    ),
    linkedin: opt(
      z
        .string()
        .min(1, "Required")
        .url(
          "Please copy paste your Linkedin URL, example: https://www.linkedin.com/in/username",
        ),
      mode.linkedin,
    ),
  });
};

export type ApplyFormData = z.infer<ReturnType<typeof buildApplyFormSchema>>;
