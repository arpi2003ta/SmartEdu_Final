import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BACKEND_URL, 
  withCredentials: true,
});

const IntroPage = () => {
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
     
      const response = await apiClient.post('/api/v1/exam/start');
      const attemptId = response.data.attemptId;

      if (attemptId) {
        
        navigate(`/exam/attempt/${attemptId}`);
      } else {
        throw new Error("Failed to get a valid attempt ID.");
      }
    } catch (error) {
      console.error("Error starting exam:", error.response?.data || error.message);
      alert("Could not start the exam. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to the Practice Test
        </h1>
        <p className="text-gray-600 mb-8">
          This test will help you prepare for the real exam. Review the rules below and click "Start Test" when you are ready.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-gray-200 py-6 mb-8">

          <div><p className="text-lg font-bold text-gray-800">90</p><p className="text-sm text-gray-500">Total Questions</p></div>
          <div><p className="text-lg font-bold text-gray-800">300</p><p className="text-sm text-gray-500">Max Marks</p></div>
          <div><p className="text-lg font-bold text-gray-800">180 Mins</p><p className="text-sm text-gray-500">Duration</p></div>
          <div><p className="text-lg font-bold text-gray-800">+4 / -1</p><p className="text-sm text-gray-500">Marking Scheme</p></div>
        </div>

        <Button 
          type="primary"
          size="large"
          onClick={handleStartTest} 
          style={{ backgroundColor: '#1f2937', fontWeight: 'bold' }}
        >

          Start Test
          
        </Button>
      </div>
      <p className="text-gray-400 mt-6 text-sm">
        All the best for your preparation!
      </p>
    </div>
  );
};

export default IntroPage;