import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { STUDENT_NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

const IconNavbar = ({ items, canChat = false, onOpenChat }) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-6 p-0 px-4">
            {items.map((item) => (
                <button
                    key={item.label}
                    title={item.label}
                    className={cn(
                        "p-2.5 rounded-xl transition-all duration-200 hover:scale-110",
                        location.pathname === item.path
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/20"
                            : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    )}
                    onClick={() => {
                        if (item.requiresEnrollment && !canChat) {
                            toast.error(
                                "You have not enrolled in any courses. Enroll in a course to access chats."
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
                    <item.icon className="h-5 w-5" />
                </button>
            ))}
        </div>
    );
};

export default IconNavbar;
