import getSessionUser from "@/lib/auth";
import Welcome from "@/components/dashboard/Welcome";
import StatsOverviewCards from "@/components/dashboard/StatsOverviewCards";
import AnalyticsAndRecentTabs from "@/components/dashboard/AnalyticsAndRecentTabs";
import NewTest from "@/components/dashboard/NewTest";
import { redirect } from "next/navigation";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

export default async function DashboardPage() {
  const user = (await getSessionUser()) as KindeUser;

  if (!user) {
    redirect("/api/auth/register");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Welcome user={user} />

        <StatsOverviewCards />

        <NewTest user={user} />

        <AnalyticsAndRecentTabs user={user} />
      </div>
    </div>
  );
}

/** Play icon component typed for SVG props */
