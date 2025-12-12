import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircle2, Filter, Search } from "lucide-react";
import { getScoreBgColor, getScoreColor, performanceOverTime } from "@/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import TestCard from "./TestCard";
import { getRecentTests } from "@/app/utils/actions";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const AnalyticsAndRecentTabs = async ({ user }: { user: KindeUser }) => {
  const recentTestsDB = await getRecentTests(user.id);

  console.log(recentTestsDB);

  return (
    <Tabs defaultValue="recent" className="space-y-6 mt-7">
      <TabsList>
        <TabsTrigger value="recent">Recent Tests</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      {/* Recent Tests Tab */}
      <TabsContent value="recent" className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Performance Tests
          </h2>
        </div>

        <div className="space-y-4">
          {recentTestsDB.map((test) => (
            <TestCard
              key={test.id}
              id={test.id}
              url={test.domain.url}
              status={test.status}
              date={new Date(test.createdAt).toLocaleString()}
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
      </TabsContent>

      {/* Analytics Tab */}
      <TabsContent value="analytics" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>
              Track your website performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {performanceOverTime.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                    style={{ height: `${(data.score / 100) * 100}%` }}
                    aria-hidden
                  />
                  <p className="text-xs text-gray-600 mt-2">{data.date}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {data.score}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    LCP (Largest Contentful Paint)
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    2.5s
                  </span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  Good - Under 2.5s threshold
                </p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    FID (First Input Delay)
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    85ms
                  </span>
                </div>
                <Progress value={90} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  Good - Under 100ms threshold
                </p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    CLS (Cumulative Layout Shift)
                  </span>
                  <span className="text-sm text-yellow-600 font-semibold">
                    0.15
                  </span>
                </div>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  Needs improvement - Target under 0.1
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">
                      Optimize Images
                    </p>
                    <p className="text-xs text-yellow-700">
                      Could save 1.2s load time
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Reduce JavaScript
                    </p>
                    <p className="text-xs text-blue-700">
                      Eliminate unused code
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Great Server Response
                    </p>
                    <p className="text-xs text-green-700">
                      Keep up the good work
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsAndRecentTabs;
