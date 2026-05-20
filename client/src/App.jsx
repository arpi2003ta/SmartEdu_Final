import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import MainLayout from "./layout/MainLayout";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import AccountLayout from "./layout/AccountLayout";

import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import StudentDashboard from "./pages/student/StudentDashboard";
import SearchPage from "./pages/student/SearchPage";
import ChatPage from "./pages/student/ChatPage";
import AIRoadmap from "./pages/student/AIRoadmap";
import TrackProgress from "./pages/student/TrackProgress";
import RoadmapHistory from "./pages/student/RoadmapHistory";
import Colleges from "./pages/student/Colleges";
import IntroPage from "./pages/student/Introduction";
import StudentExamPage from "./pages/student/StudentExamPage";
import InstructorExamPage from "./pages/admin/InstructorExamPage";
import ResultsPage from "./pages/student/ResultsPage";
import InstructorAIExaminer from "./pages/admin/InstructorAIExaminer";
import AIExaminer from "./pages/student/AIExaminer";
import AIExaminerResult from "./pages/student/AIExaminerResult";
import DetectedAnswers from "./pages/student/DetectedAnswers";

import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import HomeRedirect from "./components/HomeRedirect";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";
import { BrowserCompatibilityProvider } from "./components/BrowserCompatibility";
import ErrorBoundary from "./components/ErrorBoundary";
import { CollegePredictor } from "./pages/student/CollegePredictor";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
          </>
        ),
      },
      {
        path: "course/search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: (
          <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        ),
      },
      {
        path: "course-detail/:courseId",
        element: <CourseDetail />,
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        element: (
          <ProtectedRoute>
            <AccountLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <StudentDashboard />,
          },
          {
            path: "my-learning",
            element: <MyLearning />,
          },
          {
            path: "chat",
            element: <ChatPage />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "cbt",
            element: <IntroPage />,
          },
          {
            path: "ai-roadmap",
            element: <AIRoadmap />,
          },
          {
            path: "ai-roadmap/track-progress",
            element: <TrackProgress />,
          },
          {
            path: "ai-roadmap/history",
            element: <RoadmapHistory />,
          },
          {
            path: "college-predictor",
            element: <CollegePredictor />,
          },
          {
            path: "ai-examiner",
            element: <AIExaminer />,
          },
          {
            path: "ai-examiner/detected/:submissionId",
            element: <DetectedAnswers />,
          },
          {
            path: "ai-examiner/result/:submissionId",
            element: <AIExaminerResult />,
          },
          {
            path: "ai-examiner/colleges",
            element: <Colleges />,
          },
          {
            path: "exam/attempt/:attemptId",
            element: <StudentExamPage />,
          },
          {
            path: "exam/result/:attemptId",
            element: <ResultsPage />,
          },
        ],
      },

      // admin

      {
        path: "admin",
        element: (
          <AdminRoute>
            <Sidebar />
          </AdminRoute>
        ),
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "course", element: <CourseTable /> },
          { path: "course/create", element: <AddCourse /> },
          { path: "course/:courseId", element: <EditCourse /> },
          { path: "course/:courseId/lecture", element: <CreateLecture /> },
          { path: "ai-examiner/instructor", element: <InstructorAIExaminer /> },
          { path: "CBT/manage", element: <InstructorExamPage /> },
          { path: "profile/edit", element: <Profile /> },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <main>
      <ErrorBoundary>
        <BrowserCompatibilityProvider>
          <ThemeProvider>
            <RouterProvider
              router={appRouter}
              future={{ v7_startTransition: true }}
            />
          </ThemeProvider>
        </BrowserCompatibilityProvider>
      </ErrorBoundary>
    </main>
  );
}

export default App;
