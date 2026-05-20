import React from "react";
import { useNavigate } from "react-router-dom";
import { School } from "lucide-react";
import { Globe, Linkedin, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";  // ✅ WhatsApp icon from react-icons

const Footer = () => {
  let navigate = useNavigate();
  return (
    <footer className="bg-black text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto flex lg:items-center items-start justify-center gap-[40px] lg:gap-[150px] flex-col lg:flex-row">
        <div className="lg:w-[40%] md:w-[50%] w-[100%]">
          <div className="flex justify-center mb-4 gap-3 items-center">
            <School size={"50"} />
            <p className="font-bold text-3xl">SmartEdu</p>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Virtual Courses</h2>
          <p className="text-sm">
            AI-powered learning platform to help you grow smarter. Learn
            anything, anytime, anywhere.
          </p>
        </div>

        <div className="lg:w-[30%] md:w-[100%]">
          <h3 className="text-white font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/")}>Home</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/login")}>Login</li>
            <li className="hover:text-white cursor-pointer" onClick={() => navigate("/profile")}>My Profile</li>
          </ul>
        </div>

        <div className="lg:w-[30%] md:w-[100%]">
          <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
          <div className="flex justify-center gap-4">
            <a href="https://www.linkedin.com/in/YOUR-LINKEDIN-USERNAME" target="_blank" rel="noopener noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-blue-600 transition-colors">
              <Linkedin size={20} className="text-white" />
            </a>
            <a href="https://www.instagram.com/YOUR-INSTAGRAM-USERNAME" target="_blank" rel="noopener noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-pink-600 transition-colors">
              <Instagram size={20} className="text-white" />
            </a>
            <a href="https://www.yourwebsite.com" target="_blank" rel="noopener noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-green-600 transition-colors">
              <Globe size={20} className="text-white" />
            </a>
            <a href="https://wa.me/YOURWHATSAPPNUMBER" target="_blank" rel="noopener noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-green-500 transition-colors">
              <FaWhatsapp size={20} className="text-white" />  {/* ✅ WhatsApp icon works */}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-5 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} SmartEdu Pvt Ltd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
