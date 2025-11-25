export type DeviceType = "mobile" | "desktop";
export type ThrottlingType = "none" | "4g" | "3g" | "slow-3g";

export interface LighthouseJobData {
  url: string;
  device: DeviceType;
  throttling: ThrottlingType;
  userId: string;
  testId: string;
}

export interface ThrottlingConfig {
  rttMs: number;
  throughputKbps: number;
  requestLatencyMs: number;
  downloadThroughputKbps: number;
  uploadThroughputKbps: number;
  cpuSlowdownMultiplier: number;
}

export interface LighthouseResult {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals: {
    FCP: number;
    LCP: number;
    CLS: number;
    TBT: number;
    SI: number;
    TTI: number;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    displayValue?: string;
    savings: {
      bytes?: number;
      ms?: number;
    };
    score: number;
  }>;
  diagnostics: unknown;
  resources: unknown;
  failedAudits: unknown[];
  meta: {
    finalUrl: string;
    fetchTime: string;
    userAgent: string;
    formFactor: string;
  };
}
