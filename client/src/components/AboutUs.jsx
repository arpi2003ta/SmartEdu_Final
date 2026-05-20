import React from 'react'
import about from "../assets/about.jpg"
import VideoPlayer from './VideoPlayer'
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { BiSolidBadgeCheck } from "react-icons/bi";
function About() {
  return (
   
        <div className="w-[100vw] lg:h-[70vh] min-h-[50vh] flex flex-wrap items-center justify-center gap-2 mb-[30px]">
        {/* Left Image Section */}
        <div className="lg:w-[40%] md:w-[80%] w-[100%] h-[100%] flex items-center justify-center relative">
          <img src={about} className="w-[80%] h-[90%] rounded-lg object-cover" alt="" />
          <VideoPlayer />
        </div>

        {/* Right Content Section */}
        <div className="lg:w-[50%] md:w-[70%] w-[100%] h-[90%] flex items-start justify-between flex-col px-[35px] md:px-[60px]">
    
        {/* Heading */}
        <div>
          <div className="flex text-[18px] items-center gap-[20px]">
            About Us <TfiLayoutLineSolid className="w-[40px] h-[40px]" />
        </div>
        <div className="md:text-[40px] text-[30px] font-semibold leading-tight">
          We Maximize Your Learning Growth
        </div>
        <div className="text-[14px] mt-[10px] leading-relaxed">
          We provide a modern Learning Management System to simplify online education,
          track progress, and enhance student-instructor collaboration efficiently.
        </div>
        </div>

        {/* Features Grid */}
        <div className="w-[100%] mt-[20px] grid grid-cols-2 gap-y-[15px] gap-x-[25px] text-[14px]">
          <div className="flex items-center gap-[8px]">
            <BiSolidBadgeCheck className="w-[18px] h-[18px]" /> Simplified Learning
          </div>
          <div className="flex items-center gap-[8px]">
            <BiSolidBadgeCheck className="w-[18px] h-[18px]" /> Expert Trainers
          </div>
          
          <div className="flex items-center gap-[8px]">
            <BiSolidBadgeCheck className="w-[18px] h-[18px]" /> Lifetime Access
          </div>
          <div className="flex items-center gap-[8px]">
            <BiSolidBadgeCheck className="w-[18px] h-[18px]" /> Certification
          </div>
          <div className="flex items-center gap-[8px]">
            <BiSolidBadgeCheck className="w-[18px] h-[18px]" /> AR View Lab
          </div>
          <div className="flex items-center gap-[8px]">
            <BiSolidBadgeCheck className="w-[18px] h-[18px]" /> Personalized Roadmap
          </div>
          <div className="flex items-center gap-[8px]">
            <BiSolidBadgeCheck className="w-[18px] h-[18px]" /> CBT Exam
          </div>
          <div className="flex items-center gap-[8px]">
            <BiSolidBadgeCheck className="w-[18px] h-[18px]" /> OMR
          </div>
        </div>
      </div>
    </div>  
  )
}

export default About 