import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Settings,
  FileText,
  HelpCircle,
  Target,
  Calendar,
  BarChart2,
  Library,
} from "lucide-react";

export const STUDENT_NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: GraduationCap, label: "My learning", path: "/my-learning" },
  {
    icon: MessageSquare,
    label: "Chat with Instructor",
    action: "openChat",
    requiresEnrollment: true,
  },
  { icon: Settings, label: "Edit Profile", path: "/profile" },
  { icon: FileText, label: "CBT Practice", path: "/cbt" },
  { icon: HelpCircle, label: "AI Examiner", path: "/ai-examiner" },
  { icon: Target, label: "Personalized Roadmap", path: "/ai-roadmap" },
  { icon: Calendar, label: "College Predictor", path: "/college-predictor" },
  {
    icon: BarChart2,
    label: "Admin Dashboard",
    path: "/admin/dashboard",
    role: "instructor",
  },
  {
    icon: Library,
    label: "courses",
    path: "/admin/course",
    role: "instructor",
  },
  {
    icon: HelpCircle,
    label: "Admin AI Examiner",
    path: "/admin/ai-examiner/instructor",
    role: "instructor",
  },
  {
    icon: FileText,
    label: "Manage CBT",
    path: "/admin/CBT/manage",
    role: "instructor",
  },
  {
    icon: Settings,
    label: "Edit Profile",
    path: "/admin/profile/edit",
    role: "instructor",
  },
];
