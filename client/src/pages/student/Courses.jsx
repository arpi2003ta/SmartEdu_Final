import { Skeleton } from "@/components/ui/skeleton";
import React, { useRef } from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

const Courses = () => {
    const scrollContainerRef = useRef(null);
    const { data, isLoading, isError } = useGetPublishedCourseQuery();

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 300, 
                behavior: 'smooth' 
            });
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -300, 
                behavior: 'smooth'
            });
        }
    };

    if (isError) return <h1>Some error occurred while fetching courses.</h1>;

    return (
        <div className="bg-gray-50 dark:bg-[#141414] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="font-bold text-3xl text-center mb-4 text-gray-900 dark:text-white">Our Courses</h2>
                <p className="font-semibold text-xl text-center mb-4">We provide NEET and JEE based curriculum.</p>
                
                <div className="relative">
                    <div ref={scrollContainerRef} className="flex overflow-x-auto scroll-smooth scrollbar-hide space-x-6 px-4 py-2 snap-x snap-mandatory">
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="flex-shrink-0 w-[280px] snap-start">
                                    <CourseSkeleton />
                                </div>
                            ))
                        ) : (
                            data?.courses && data.courses.map((course, index) => (
                                <div key={index} className="flex-shrink-0 w-[280px] snap-start">
                                    <Course course={course} />
                                </div>
                            ))
                        )}
                    </div>

                    <button 
                        onClick={scrollLeft} 
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-black/70 p-2 rounded-full shadow-lg hover:bg-white z-10 transition-transform active:scale-90 hidden md:flex items-center justify-center"
                        aria-label="Scroll Left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button 
                        onClick={scrollRight} 
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-black/70 p-2 rounded-full shadow-lg hover:bg-white z-10 transition-transform active:scale-90 hidden md:flex items-center justify-center"
                        aria-label="Scroll Right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Courses;


const CourseSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
            <Skeleton className="w-full h-36 bg-gray-300 dark:bg-gray-700" />
            <div className="px-5 py-4 space-y-3">
                <Skeleton className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-20 bg-gray-300 dark:bg-gray-700" />
                    </div>
                    <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-gray-700" />
                </div>
                <Skeleton className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700" />
            </div>
        </div>
    );
};
