"use client";

import { useEffect, useState } from "react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getRecentTests } from "@/app/utils/actions";
import TestCard from "./TestCard";

// Define the type for the data returned from getRecentTests
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

const RecentTests = ({ user }: { user: KindeUser }) => {
  // Properly type the state with the RecentTestData array
  const [tests, setTests] = useState<RecentTestData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const recentTests = await getRecentTests(user.id);
        setTests(recentTests);
      } catch (error) {
        console.error("Error fetching recent tests:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately on mount
    fetchTests();

    // Set up polling every 5 seconds
    const intervalId = setInterval(fetchTests, 5000);

    // Cleanup: clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, [user.id]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading recent tests...
      </div>
    );
  }

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
