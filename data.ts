import { Test } from "./types/types";

export const recentTests: Test[] = [
  {
    id: 1,
    url: "https://example.com",
    date: "2 hours ago",
    status: "completed",
    score: 94,
    device: "desktop",
    fcp: 1.2,
    lcp: 2.5,
    tti: 3.8,
    cls: 0.1,
    speedIndex: 2.1,
  },
  {
    id: 2,
    url: "https://mystore.com",
    date: "5 hours ago",
    status: "completed",
    score: 67,
    device: "mobile",
    fcp: 2.8,
    lcp: 4.2,
    tti: 6.5,
    cls: 0.25,
    speedIndex: 4.8,
  },
  {
    id: 3,
    url: "https://blog.example.org",
    date: "1 day ago",
    status: "completed",
    score: 88,
    device: "desktop",
    fcp: 1.5,
    lcp: 2.9,
    tti: 4.2,
    cls: 0.05,
    speedIndex: 2.8,
  },
  {
    id: 4,
    url: "https://portfolio.dev",
    date: "2 days ago",
    status: "failed",
    score: null,
    device: "mobile",
    fcp: null,
    lcp: null,
    tti: null,
    cls: null,
    speedIndex: null,
  },
  {
    id: 5,
    url: "https://news.site.com",
    date: "3 days ago",
    status: "completed",
    score: 49,
    device: "desktop",
    fcp: 2.1,
    lcp: 3.8,
    tti: 5.2,
    cls: 0.18,
    speedIndex: 3.9,
  },
];

// Placeholder data
export const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  plan: "Pro",
  testsThisMonth: 47,
  testsLimit: 100,
};

export const performanceOverTime = [
  { date: "Jan 15", score: 78 },
  { date: "Jan 18", score: 82 },
  { date: "Jan 21", score: 85 },
  { date: "Jan 24", score: 88 },
  { date: "Jan 27", score: 94 },
];

export const getScoreColor = (score?: number | null): string => {
  if (typeof score !== "number") return "text-gray-500";
  if (score >= 90) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
};
export const getScoreBgColor = (score?: number | null): string => {
  if (typeof score !== "number") return "bg-gray-100";
  if (score >= 90) return "bg-green-100";
  if (score >= 50) return "bg-yellow-100";
  return "bg-red-100";
};
