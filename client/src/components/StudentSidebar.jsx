import { Home } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { STUDENT_NAV_ITEMS } from "@/constants/navigation";

const StudentSidebar = ({ canChat = false, onOpenChat }) => {
  const location = useLocation();
  const navigate = useNavigate();

  /*const navItems = STUDENT_NAV_ITEMS;*/
  // show only student items
  const navItems = STUDENT_NAV_ITEMS.filter(
    (item) => item.role !== "instructor",
  );
  return (
    <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-16 bottom-0 border-r bg-background z-40">
      <div className="px-4 py-4 border-b">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </button>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === item.path
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            onClick={() => {
              if (item.requiresEnrollment && !canChat) {
                toast.error(
                  "You have not enrolled in any courses. Enroll in a course to access chats.",
                );
                return;
              }
              if (item.action === "openChat") {
                if (typeof onOpenChat === "function") onOpenChat();
                return;
              }
              if (item.path) navigate(item.path);
            }}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default StudentSidebar;
