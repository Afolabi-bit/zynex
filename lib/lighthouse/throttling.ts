// lib/lighthouse/throttling.ts
import { ThrottlingType, ThrottlingConfig } from "@/types/lighthouse";

export function getThrottlingConfig(type: ThrottlingType): ThrottlingConfig {
  const configs: Record<ThrottlingType, ThrottlingConfig> = {
    none: {
      rttMs: 0,
      throughputKbps: 0,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
      cpuSlowdownMultiplier: 1,
    },
    "4g": {
      rttMs: 40,
      throughputKbps: 10240,
      requestLatencyMs: 0,
      downloadThroughputKbps: 9216,
      uploadThroughputKbps: 2304,
      cpuSlowdownMultiplier: 4,
    },
    "3g": {
      rttMs: 150,
      throughputKbps: 1638,
      requestLatencyMs: 562.5,
      downloadThroughputKbps: 1474.5,
      uploadThroughputKbps: 614.4,
      cpuSlowdownMultiplier: 4,
    },
    "slow-3g": {
      rttMs: 400,
      throughputKbps: 400,
      requestLatencyMs: 2000,
      downloadThroughputKbps: 400,
      uploadThroughputKbps: 400,
      cpuSlowdownMultiplier: 4,
    },
  };

  return configs[type];
}
