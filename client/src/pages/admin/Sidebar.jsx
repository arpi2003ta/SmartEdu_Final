import {
  ChartNoAxesColumn,
  SquareLibrary,
  MessageSquare,
  HelpCircle,
  FileText,
  Settings,
} from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import Chat from "@/components/Chat";

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 fixed left-0 top-16 bottom-0 bg-background z-40 overflow-y-auto">
        <div className="space-y-4 ">
          {/*<Link
            to="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <h1>Got back to Home</h1>
          </Link> */}
          <Link to="dashboard" className="flex items-center gap-2">
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </Link>
          <Link to="course" className="flex items-center gap-2">
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </Link>
          <Link
            to="/admin/ai-examiner/instructor"
            className="flex items-center gap-2"
          >
            <HelpCircle size={22} />
            <h1>AI Examiner</h1>
          </Link>
          <Link to="CBT/manage" className="flex items-center gap-2">
            <FileText size={22} />
            <h1>Manage CBT</h1>
          </Link>
          <Link to="profile/edit" className="flex items-center gap-2">
            <Settings size={22} />
            <h1>Edit Profile</h1>
          </Link>

          <Chat
            triggerButton={
              <button className="flex items-center gap-2 w-full">
                <MessageSquare size={22} />
                <h1>Messages</h1>
              </button>
            }
          />
        </div>
      </div>
      <div className="flex-1 p-10 lg:ml-[300px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
