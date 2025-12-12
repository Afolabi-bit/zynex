import {
  BarChart3,
  Clock,
  Globe,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { userData } from "@/data";

const StatsOverviewCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tests This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {userData.testsThisMonth}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                of {userData.testsLimit} limit
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Progress
            value={(userData.testsThisMonth / userData.testsLimit) * 100}
            className="mt-4"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Performance</p>
              <p className="text-3xl font-bold text-green-600 mt-1">84</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <p className="text-xs text-green-600">+6 from last week</p>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Sites</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">8</p>
              <p className="text-xs text-gray-500 mt-1">Being monitored</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Load Time</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">2.4s</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                <p className="text-xs text-green-600">-0.3s improved</p>
              </div>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverviewCards;
