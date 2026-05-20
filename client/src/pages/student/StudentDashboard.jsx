import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetStudentDashboardQuery } from "@/features/api/authApi";
import { useGetSearchSuggestionsQuery } from "@/features/api/searchApi";
import { toast } from "sonner";
import Chat from "@/components/Chat";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Trophy,
  Flame,
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Calendar,
  Settings,
  Search,
  ArrowRight,
  TrendingUp,
  CalendarClock,
  Target,
  Video,
  FileText,
  HelpCircle
} from "lucide-react";

// --- Utility Components ---

const getProgressColor = (value) => {
  if (value >= 100) return "bg-emerald-500";
  if (value >= 50) return "bg-blue-500";
  return "bg-amber-500";
};


// 2. Stat Card
const StatCard = ({ icon: Icon, label, value, trend, trendUp }) => (
  <Card className="shadow-sm border-none bg-white dark:bg-zinc-900 ring-1 ring-slate-900/5 hover:ring-slate-900/10 transition-all">
    <CardContent className="p-5 flex items-center justify-between">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</div>
        {trend && (
          <div className={`text-xs font-medium flex items-center gap-1 ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
            <TrendingUp className={`h-3 w-3 ${!trendUp && 'rotate-180'}`} /> {trend}
          </div>
        )}
      </div>
      <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-slate-100">
        <Icon className="h-6 w-6 opacity-80" />
      </div>
    </CardContent>
  </Card>
);

// 3. Course List Item
const CourseItem = ({ course, navigate }) => {
  const progress = course.progressPercent || 0;
  return (
    <div className="group flex items-center gap-4 p-3 rounded-xl border bg-card hover:border-emerald-500/30 hover:shadow-sm transition-all cursor-pointer" onClick={() => navigate(`/course-progress/${course._id}`)}>
      <div className="h-16 w-16 sm:h-20 sm:w-24 rounded-lg bg-muted overflow-hidden flex-shrink-0 relative">
        {course.courseThumbnail ? (
          <img src={course.courseThumbnail} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-emerald-100 text-emerald-600">
            <BookOpen className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-semibold text-sm sm:text-base truncate pr-2 text-slate-900 dark:text-slate-100">
            {course.courseTitle}
          </h4>
          <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex h-5">
            {course.courseLevel || "Beginner"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3 truncate">
          {course.creator?.name || "Instructor"}
        </p>
        <div className="flex items-center gap-3">
          <Progress value={progress} className="h-1.5 flex-1" indicatorColor={getProgressColor(progress)} />
          <span className="text-xs font-medium w-8 text-right text-muted-foreground">{progress}%</span>
        </div>
      </div>
      <div className="h-8 w-8 rounded-full border flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-colors">
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  );
};


const StudentDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetStudentDashboardQuery();
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const profile = data?.profile;
  const stats = data?.stats;
  const courses = data?.courses || [];
  const rawWeeklyActivity = data?.weeklyActivity && data.weeklyActivity.length === 7
    ? data.weeklyActivity
    : [0, 0, 0, 0, 0, 0, 0];

  const streak = data?.streak || { current: 0, longest: 0 };
  const topicPerformance = data?.topicPerformance || [];
  const upcomingExams = data?.upcomingExams || [];

  const firstName = profile?.firstName || "Student";

  const [searchQuery, setSearchQuery] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [debouncedQuery, setDebouncedQuery] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: suggestionsData, isLoading: suggestionsLoading } = useGetSearchSuggestionsQuery(
    debouncedQuery,
    { skip: debouncedQuery.trim().length < 2 }
  );

  const suggestions = suggestionsData?.suggestions || [];

  const weeklyActivity = React.useMemo(() => {
    if (!rawWeeklyActivity || rawWeeklyActivity.length === 0) return [35, 60, 45, 80, 50, 70, 40];
    const max = Math.max(...rawWeeklyActivity, 1);
    return rawWeeklyActivity.map((v) => Math.max(10, Math.round((v * 100) / max)));
  }, [rawWeeklyActivity]);

  const topicData = React.useMemo(() => {
    const base = topicPerformance && topicPerformance.length ? topicPerformance : [
      { label: "Frontend Dev", value: 92 },
      { label: "UI/UX Design", value: 78 },
      { label: "Backend Logic", value: 64 },
      { label: "Algorithms", value: 45 },
    ];
    const colors = ["bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-slate-500"];
    const max = Math.max(...base.map((t) => t.value || 0), 1);
    return base.map((t, i) => ({
      label: t.label,
      percent: Math.round(((t.value || 0) * 100) / max),
      colorClass: colors[i % colors.length],
    }));
  }, [topicPerformance]);

  const [dailyGoalMinutes, setDailyGoalMinutes] = React.useState(120); // default 2h

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("dailyGoalMinutes");
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!Number.isNaN(parsed) && parsed > 0) {
          setDailyGoalMinutes(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("dailyGoalMinutes", String(dailyGoalMinutes));
    } catch {
      // ignore storage errors
    }
  }, [dailyGoalMinutes]);

  const todayMinutes = rawWeeklyActivity[rawWeeklyActivity.length - 1] || 0;
  const dailyTargetPercent = Math.min(100, Math.round((todayMinutes * 100) / dailyGoalMinutes));
  const todayHours = todayMinutes === 0 ? "0" : (todayMinutes / 60).toFixed(1);
  const dailyGoalHours = (dailyGoalMinutes / 60).toFixed(1);

  const handleSearch = (query = searchQuery) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/course/search?query=${encodeURIComponent(trimmed)}`);
    setShowSuggestions(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.trim().length >= 2);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <div className="flex flex-col">

      {/* Header */}
      <header className="h-16 border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              placeholder="Search for courses..."
              className="h-9 w-full rounded-full border border-slate-200 bg-slate-100/50 dark:bg-slate-800 dark:border-slate-700 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />

            {showSuggestions && (suggestionsLoading || suggestions.length > 0) && (
              <div className="absolute z-50 mt-1 left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-56 overflow-y-auto text-sm">
                {suggestionsLoading ? (
                  <div className="px-3 py-2 text-slate-400">Searching...</div>
                ) : (
                  suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(s);
                      }}
                    >
                      <Search className="h-3 w-3 text-slate-400" />
                      <span className="truncate">{s}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 p-6 space-y-6 w-full">

        {/* Welcome & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Welcome back, {firstName}. You have <span className="font-medium text-emerald-600">2 tasks</span> pending today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/course/search")} className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">
              Explore Courses
            </Button>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={BookOpen}
            label="Total Enrolled"
            value={isLoading ? "--" : stats?.total ?? 0}
            trend="+2 this month"
            trendUp={true}
          />
          <StatCard
            icon={Clock}
            label="Study Hours"
            value={isLoading ? "--" : `${stats?.totalHours ?? "0"}h`}
            trend="+12% vs last week"
            trendUp={true}
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={isLoading ? "--" : stats?.completed ?? 0}
            trend="Keep going!"
            trendUp={true}
          />
          <StatCard
            icon={Trophy}
            label="Avg. Score"
            value={isLoading || stats?.avgScore == null ? "--" : `${stats.avgScore}%`}
            trend="-2% vs last week"
            trendUp={false}
          />
        </div>

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

          {/* LEFT COLUMN (Content & Charts) - Spans 2 cols */}
          <div className="xl:col-span-2 space-y-6">

            {/* 1. Bar Chart & Topic Performance Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Activity Graph */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Weekly Activity</CardTitle>
                  <CardDescription>Time spent learning per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[180px] flex items-end justify-between gap-2">
                    {weeklyActivity.map((height, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <div
                          className="w-full max-w-[32px] bg-slate-100 dark:bg-slate-800 rounded-t-sm relative overflow-hidden transition-all group-hover:bg-slate-200"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 opacity-90 h-full transform translate-y-[20%] group-hover:translate-y-0 transition-transform duration-500 rounded-t-sm" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase">
                          {["S", "M", "T", "W", "T", "F", "S"][idx]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subject Performance Widget (API-driven) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Topic Performance</CardTitle>
                  <CardDescription>Your strongest areas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {topicData.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span>{item.label}</span>
                        <span className="text-muted-foreground">{item.percent}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${item.colorClass} rounded-full`} style={{ width: `${item.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* 2. Enrolled Courses List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  In Progress Courses
                </h2>
                <Button variant="link" className="text-emerald-600 h-auto p-0 text-xs">View All</Button>
              </div>
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {courses.map((course) => (
                    <CourseItem key={course._id} course={course} navigate={navigate} />
                  ))}
                </div>
              ) : (
                <Card className="border-dashed shadow-none bg-slate-50">
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <BookOpen className="h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">No active courses.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (Widgets) - Spans 1 col */}
          <div className="space-y-6">

            {/* Daily Goal Ring Widget (NEW) */}
            <Card className="bg-emerald-600 text-white border-none shadow-lg relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-white">
                  <Target className="h-4 w-4" /> Daily Target
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center pb-6">
                <div className="relative h-32 w-32 flex items-center justify-center">
                  {/* CSS-based Circular Progress mockup */}
                  <div className="absolute inset-0 rounded-full border-[8px] border-emerald-500"></div>
                  <div className="absolute inset-0 rounded-full border-[8px] border-white border-l-transparent border-b-transparent rotate-45"></div>
                  <div className="text-center">
                    <span className="text-3xl font-bold">{dailyTargetPercent}%</span>
                    <p className="text-[10px] text-emerald-100 uppercase tracking-wide">Achieved</p>
                  </div>
                </div>
                <p className="text-sm mt-2 font-medium text-emerald-50">{todayHours}h / {dailyGoalHours}h Goal</p>
                <div className="mt-3 flex items-center gap-1 text-[10px]">
                  <span className="uppercase tracking-wide text-emerald-100/80 mr-1">Set goal:</span>
                  {[60, 120, 180].map((minutes) => {
                    const label = `${minutes / 60}h`;
                    const active = minutes === dailyGoalMinutes;
                    return (
                      <button
                        key={minutes}
                        type="button"
                        onClick={() => setDailyGoalMinutes(minutes)}
                        className={`px-2 py-1 rounded-full border text-[10px] transition-colors ${active
                          ? "bg-white text-emerald-700 border-white"
                          : "border-emerald-400/70 text-emerald-50/90 hover:bg-emerald-500/40"
                          }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Exams */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Upcoming</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingExams.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No upcoming exams scheduled.</p>
                ) : (
                  upcomingExams.map((exam, i) => {
                    const colorClasses = [
                      "text-red-600 bg-red-50 dark:bg-red-900/20",
                      "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
                      "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
                    ];
                    const color = colorClasses[i % colorClasses.length];
                    return (
                      <div key={exam.id || i} className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center ${color}`}>
                          <CalendarClock className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{exam.title}</h5>
                          <p className="text-[11px] text-muted-foreground font-medium">{exam.dateLabel || exam.date}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Streak Small Widget (API-driven) */}
            <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">{streak.current || 0} Day Streak</p>
                  <p className="text-xs text-slate-400">Longest: {streak.longest || 0} days</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="h-8 text-xs bg-white text-slate-900 hover:bg-slate-200">View</Button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;