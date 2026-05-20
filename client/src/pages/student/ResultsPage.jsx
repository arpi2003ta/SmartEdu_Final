import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BACKEND_URL, 
  withCredentials: true,
});

const ResultsPage = () => {
  const { attemptId } = useParams();
  const { user } = useSelector((store) => store.auth);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const triggerResultCalculation = async () => {

      try {
        const response = await apiClient.post(`/api/v1/result/calculate/${attemptId}`);
        setResult(response.data.result);
      } catch (err) {
        setError("Could not calculate or load results.");
        console.error("Failed to trigger result calculation:", err);
      } finally {
        setIsLoading(false);
      }

    };
    triggerResultCalculation();
  }, [attemptId]);

  const displayData = useMemo(() => {
    if (!result) return null;


    const combinedSubjects = result.subjectWiseScore.map(scoreItem => {
      const timeItem = result.subjectWiseTimeSpent.find(t => t.subject === scoreItem.subject);
      return {
        subject: scoreItem.subject,
        score: scoreItem.Score,
        timeSpent: timeItem ? timeItem.timeSpent : 0,
        maxMarks: 100

        
      };
    });
    
    const totalTime = result.subjectWiseTimeSpent.reduce((sum, sub) => sum + sub.timeSpent, 0);
    const totalMaxMarks = 300; 

    return {
      subjects: combinedSubjects,
      totalScore: result.score,
      totalMaxMarks: totalMaxMarks,
      totalTime: totalTime,
    };
  }, [result]);


  const formatTime = (seconds) => {
    if (seconds === 0) return "0s";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    let timeString = "";
    if (minutes > 0) timeString += `${minutes}m `;
    if (remainingSeconds > 0) timeString += `${remainingSeconds}s`;
    return timeString.trim();
  };

  if (isLoading) return <div className="p-8 text-center">Calculating your results...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!displayData) return <div className="p-8 text-center">No result data found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-bold text-center mb-2">Result</h1>
        <p className="text-center text-lg text-gray-400 mb-8">
          Congratulations {user?.name}! You have scored:
        </p>

    
        <div className="flex justify-between items-center px-4 text-sm font-semibold text-gray-500 mb-2">
            <span className="w-1/3 text-left">Subject</span>
            <span className="w-1/3 text-center">Marks</span>
            <span className="w-1/3 text-right">Time Consumed</span>
        </div>

        <div className="space-y-3">
          {displayData.subjects.map((item) => (
            <div key={item.subject} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <span className="w-1/3 text-left font-bold text-lg">{item.subject}</span>
              <span className="w-1/3 text-center font-semibold">{item.score} / {item.maxMarks}</span>
              <span className="w-1/3 text-right text-gray-400">{formatTime(item.timeSpent)}</span>
            </div>
          ))}
        </div>

        
        <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-600 flex justify-between items-center">
          <span className="w-1/3 text-left font-bold text-xl">Total</span>
          <span className="w-1/3 text-center font-bold text-xl text-cyan-400">{displayData.totalScore} / {displayData.totalMaxMarks}</span>
          <span className="w-1/3 text-right text-lg text-gray-300">{formatTime(displayData.totalTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;