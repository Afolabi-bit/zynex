"use client";

import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import TestCard from "./TestCard";
import { Loader2 } from "lucide-react";
import useSWR from "swr";

// Define the type for the data returned from the API
type RecentTestData = {
  id: number;
  createdAt: Date;
  domainId: number;
  status: string;
  domain: {
    id: number;
    createdAt: Date;
    url: string;
    device: string;
    network: string;
    ownerId: string;
    updatedAt: Date;
  };
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const RecentTests = ({ user }: { user: KindeUser }) => {
  const { data, error, isLoading } = useSWR(
    `/api/tests/recent?userId=${user.id}`,
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-center py-8 text-gray-500">
        <span className="flex items-center">
          <Loader2 className="text-blue-600 h-4 w-4 mr-2 animate-spin" />
          <span>Loading recent tests...</span>
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load tests. Please try again.
      </div>
    );
  }

  const tests: RecentTestData[] = data?.tests || [];

  if (tests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tests found. Submit your first test above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tests.map((test) => (
        <TestCard
          key={test.id}
          id={test.id}
          url={test.domain.url}
          status={test.status}
          date={new Date(test.createdAt).toLocaleDateString()}
          device={test.domain.device}
          score={null}
          fcp={null}
          lcp={null}
          tti={null}
          cls={null}
          speedIndex={null}
        />
      ))}
    </div>
  );
};

export default RecentTests;
