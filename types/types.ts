import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

export interface Test {
  id: number;
  url: string;
  date: string;
  status: "completed" | "failed" | "pending" | "running";
  score?: number | null;
  device: "desktop" | "mobile" | string;
  fcp?: number | null | undefined;
  lcp?: number | null | undefined;
  tti?: number | null | undefined;
  cls?: number | null | undefined;
  speedIndex?: number | null | undefined;
}

export interface myKindeUser {
  user: KindeUser<Record<string, null>> | null;
}
