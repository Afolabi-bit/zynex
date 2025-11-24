import React from "react";
import { Button } from "../ui/button";
import { Settings, User, Zap } from "lucide-react";
import Image from "next/image";
import { myKindeUser } from "@/types/types";
import Link from "next/link";

const DashboardNav = ({ user }: myKindeUser) => {
  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Zynex
              </span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-900 font-medium">
                Docs
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <div className="flex items-center space-x-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.given_name}
                </p>
              </div>
              <Link href={"/profile"} className="rounded-full">
                {user?.picture ? (
                  <span className="relative  size-[50px]">
                    <Image
                      src={user.picture}
                      alt="user"
                      fill
                      className=" object-cover rounded-full"
                    />
                  </span>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
