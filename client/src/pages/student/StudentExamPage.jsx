import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const BACKEND_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

const StudentExamPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(180 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState({});
  const intervalRef = useRef(null);

  useEffect(() => {
    const checkStatusAndFetchQuestions = async () => {
      try {
        const statusResponse = await apiClient.get(`/api/v1/exam/status/${attemptId}`);
        if (statusResponse.data.submittedAt) {
          setIsSubmitted(true);
          setIsLoading(false);
          return;
        }
        const questionsResponse = await apiClient.get('/api/v1/questions');
        setQuestions(questionsResponse.data);
      } catch (err) {
        setError('Failed to load exam questions. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    checkStatusAndFetchQuestions();
  }, [attemptId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    const currentQuestionId = questions[currentQuestionIndex]?._id;
    if (!currentQuestionId) return;
    intervalRef.current = setInterval(() => {
      setTimeSpentPerQuestion(prev => ({
        ...prev,
        [currentQuestionId]: (prev[currentQuestionId] || 0) + 1,
      }));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [currentQuestionIndex, questions]);

  const handleAnswerChange = async (questionId, selectedValue) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedValue }));
    try {
      await apiClient.post('/api/v1/exam/save', {
        attemptId,
        questionId,
        answer: selectedValue,
        timeSpent: timeSpentPerQuestion[questionId] || 0,
      });
    } catch (error) {
      console.error("Failed to save answer:", error);
    }
  };

  const handleSubmit = async () => {
    if (window.confirm("Are you sure you want to submit the exam?")) {
      try {
        await apiClient.post(`/api/v1/exam/submit/${attemptId}`);
        navigate(`/exam/result/${attemptId}`);
      } catch (error) {
        alert("There was an error submitting your exam.");
        console.error(error);
      }
    }
  };

  const handleNext = () => { if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(p => p + 1); };
  const handlePrevious = () => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(p => p - 1); };
  const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  if (isLoading) return <div className="p-8 text-center">Checking exam status...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4">Exam Already Submitted</h1>
        <p className="text-lg text-muted-foreground mb-6">You have already completed this exam attempt.</p>
        <Button onClick={() => navigate(`/exam/result/${attemptId}`)}>View Your Result</Button>
      </div>
    );
  }
  if (questions.length === 0) return <div className="p-8 text-center">No questions available.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-card p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-primary">{currentQuestion.subject}</h1>
        <div className="text-xl font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-md">Time Left: {formatTime(timeLeft)}</div>
      </div>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <p className="text-lg font-semibold mb-4">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <h2 className="text-xl mb-6">{currentQuestion.question}</h2>

        {currentQuestion.questionType === 'MCQ' ? (
          <RadioGroup value={answers[currentQuestion._id] || ""} onValueChange={(value) => handleAnswerChange(currentQuestion._id, value)}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 my-2 border rounded-md hover:bg-muted">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option.optionText}</Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="mt-4">
            <Label htmlFor="integerAnswer" className="font-semibold">Enter Your Numerical Answer:</Label>
            <Input
              id="integerAnswer"
              type="number"
              step="any"
              className="mt-2 text-lg"
              value={answers[currentQuestion._id] || ""}
              onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
              placeholder="Your answer..."
            />
          </div>
        )}
    
      </div>
      <div className="flex justify-between mt-8">
        <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</Button>
        <Button className="bg-gray-700 hover:bg-red-600 text-white" onClick={handleSubmit}>Submit Exam</Button>
        <Button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>Next</Button>
      </div>
    </div>
  );
};
export default StudentExamPage;

