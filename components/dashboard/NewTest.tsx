import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Loader2, Zap } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const NewTest = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2 text-blue-600" />
          Run New Performance Test
        </CardTitle>
        <CardDescription>
          Test your website&apos;s performance and get detailed insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="device">Device</Label>
            <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md">
              <option>Desktop</option>
              <option>Mobile</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="network">Network</Label>
            <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md">
              <option>No Throttling</option>
              <option>4G</option>
              <option>3G</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              {false ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Test
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewTest;

const Play: React.FC<React.SVGProps<SVGSVGElement>> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
