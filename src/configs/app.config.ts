import { env } from "./env";
import pkg from "../../package.json";

export type Role = "admin" | "recruiter" | "applicant";

export type FeatureFlags = {
  enableI18n: boolean;
  enableCharts: boolean;
  enableWebAuthn: boolean;
};

type aplications = {
  author: string;
  canonical: string;
  description: string;
  keywords: string;
  name: string;
  publisher: string;
  robots: string;
};

export type AppConfig = {
  name: string;
  version: string;
  urls: {
    base?: string | undefined;
    apis?: string | undefined;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
  features: FeatureFlags;
  authSecret: string;
  application: aplications;
};

export const AppConfig: AppConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  version: (pkg as any).version ?? "0.0.0",
  urls: {
    base: env.NEXT_PUBLIC_APP_URL,
    apis: env.NEXT_PUBLIC_API_HOST,
  },
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  features: {
    enableI18n: true,
    enableCharts: true,
    enableWebAuthn: false,
  },
  application: {
    author: "Roni Eka S",
    canonical: "https://www.ghossan-creative.my.id", // Comming Soon
    description: "Anything that can describe this website purposes",
    keywords: "Hiring, Job, Careers, Recruitment",
    name: "Hiring Hub",
    publisher: "hiring-hub",
    robots: "index, follow",
  },
  authSecret:
    env.JWT_AUTH_SECRET ??
    "sebuah-secret-yang-sangat-panjang-dan-rumit-sekali-du21hhd19",
} as const;
