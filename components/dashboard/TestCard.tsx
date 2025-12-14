import {
  Badge,
  CheckCircle2,
  Clock,
  Download,
  Monitor,
  Share2,
  Smartphone,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { getScoreBgColor, getScoreColor } from "@/data";
import { Button } from "../ui/button";

interface Test {
  id: number;
  url: string;
  status: string;
  date: string;
  device: string;
  score: number | null;
  fcp: number | null;
  lcp: number | null;
  tti: number | null;
  cls: number | null;
  speedIndex: number | null;
}

const TestCard = ({
  id,
  url,
  status,
  date,
  device,
  score,
  fcp,
  lcp,
  tti,
  cls,
  speedIndex,
}: Test) => {
  const test = {
    id,
    url,
    status,
    date,
    device,
    score,
    fcp,
    lcp,
    tti,
    cls,
    speedIndex,
  };
  return (
    <Card
      key={test.id}
      className={`hover:shadow-md transition-shadow cursor-pointer ${
        test.status === "pending"
          ? "opacity-70 bg-gray-100 cursor-not-allowed pointer-events-none"
          : ""
      }`}
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
                    {test.speedIndex != null ? `${test.speedIndex}s` : "—"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {test.status === "completed" && (
            <div className="ml-6 text-center">
              <div
                className={`text-5xl font-bold ${getScoreColor(test.score)}`}
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
  );
};

export default TestCard;
