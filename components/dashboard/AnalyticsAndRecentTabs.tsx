import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  AlertCircle,
  Badge,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Monitor,
  Search,
  Share2,
  Smartphone,
  XCircle,
} from "lucide-react";
import {
  getScoreBgColor,
  getScoreColor,
  performanceOverTime,
  recentTests,
} from "@/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";

const AnalyticsAndRecentTabs = () => {
  return (
    <Tabs defaultValue="analytics" className="space-y-6">
      <TabsList>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="recent">Recent Tests</TabsTrigger>
      </TabsList>

      {/* Recent Tests Tab */}
      <TabsContent value="recent" className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Performance Tests
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {recentTests.map((test) => (
            <Card
              key={test.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                        {test.url}
                      </h3>
                      {test.status === "completed" && (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {test.status === "failed" && (
                        <Badge className="bg-red-50 text-red-700 border-red-200">
                          <XCircle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {test.date}
                      </span>
                      <span className="flex items-center">
                        {test.device === "desktop" ? (
                          <Monitor className="h-4 w-4 mr-1" />
                        ) : (
                          <Smartphone className="h-4 w-4 mr-1" />
                        )}
                        {test.device}
                      </span>
                    </div>

                    {test.status === "completed" && (
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">FCP</p>
                          <p className="text-sm font-semibold">
                            {test.fcp != null ? `${test.fcp}s` : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">LCP</p>
                          <p className="text-sm font-semibold">
                            {test.lcp != null ? `${test.lcp}s` : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">TTI</p>
                          <p className="text-sm font-semibold">
                            {test.tti != null ? `${test.tti}s` : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">CLS</p>
                          <p className="text-sm font-semibold">
                            {test.cls != null ? `${test.cls}` : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Speed Index</p>
                          <p className="text-sm font-semibold">
                            {test.speedIndex != null
                              ? `${test.speedIndex}s`
                              : "—"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {test.status === "completed" && (
                    <div className="ml-6 text-center">
                      <div
                        className={`text-5xl font-bold ${getScoreColor(
                          test.score
                        )}`}
                      >
                        {typeof test.score === "number" ? test.score : "—"}
                      </div>
                      <div
                        className={`text-xs font-medium mt-1 px-3 py-1 rounded-full ${getScoreBgColor(
                          test.score
                        )} ${getScoreColor(test.score)}`}
                      >
                        {typeof test.score === "number"
                          ? test.score >= 90
                            ? "Good"
                            : test.score >= 50
                            ? "Needs Work"
                            : "Poor"
                          : "Unknown"}
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Share2 className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
