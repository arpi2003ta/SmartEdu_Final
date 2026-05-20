import React from "react";
import { useNavigate } from "react-router-dom";
import Chat from "@/components/Chat";
import { Button } from "@/components/ui/button";
import { useGetStudentDashboardQuery } from "@/features/api/authApi";

const ChatPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetStudentDashboardQuery();
  const courses = data?.courses || [];
  const canChat = courses.length > 0;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!canChat) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="rounded-lg border p-6 bg-white">
          <h1 className="text-xl font-semibold mb-2">Chat with Instructor</h1>
          <p className="text-sm text-gray-600 mb-4">
            You have not enrolled in any courses. Enroll in a course to access chats.
          </p>
          <Button onClick={() => navigate("/course/search")}>Explore Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Chat defaultOpen hideTrigger />
    </div>
  );
};

export default ChatPage;
