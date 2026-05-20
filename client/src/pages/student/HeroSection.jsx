import AboutUs from "@/components/AboutUs";
import Logos from "@/components/logos";
import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Courses from "./Courses";
import Footer from "@/components/Footer";
import AISearchBar from "@/components/AISearchBar";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const enrolledCourses = user?.enrolledCourses || [];
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 pt-32 px-4 text-center min-h-[400px]">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-white text-4xl font-bold mb-4">
          Find the Best Courses for You
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn, and Upskill with our wide range of courses
        </p>

        <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6">
          <AISearchBar className="flex-grow border-none focus-visible:ring-0 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
        </div>
        <Button onClick={() => navigate(`/course/search`)} className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200">Explore Courses</Button>
      </div>
      <Logos />
      <Courses />
      <AboutUs />
      <Footer />


    </div>
  );
};

export default HeroSection;
