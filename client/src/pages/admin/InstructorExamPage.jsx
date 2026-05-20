import React, { useState, useEffect } from 'react';
import SubjectSection from '@/components/SubjectSection';
import QuestionForm from '@/components/QuestionForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BACKEND_URL, 
  withCredentials: true,
});

const InstructorExamPage = () => {
  const [questions, setQuestions] = useState({ maths: [], physics: [], chemistry: [] });
  const [isLoading, setIsLoading] = useState(true);

  // --- FIX 1: Add the necessary state variables ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null); 
  const [editingQuestion, setEditingQuestion] = useState(null);

  const fetchQuestions = async () => {
    // This function is correct
    try {
      const response = await apiClient.get('/api/v1/questions');
      const data = response.data;
      setQuestions({
        maths: data.filter(q => q.subject === 'Maths'),
        physics: data.filter(q => q.subject === 'Physics'),
        chemistry: data.filter(q => q.subject === 'Chemistry'),
      });
    } catch (err) {
      console.error("Failed to load questions.", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // --- FIX 2: Correctly update state to open the form ---
  const handleAddQuestion = (subject) => {
    setCurrentSubject(subject); 
    setEditingQuestion(null);   
    setIsFormOpen(true);        
  };

  const handleEditQuestion = (questionId) => {
    const allQuestions = [...questions.maths, ...questions.physics, ...questions.chemistry];
    const questionToEdit = allQuestions.find(q => q._id === questionId);
    setEditingQuestion(questionToEdit);
    setIsFormOpen(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Are you sure?")) {
      await apiClient.delete(`/api/v1/questions/${questionId}`);
      fetchQuestions(); // Refresh the list
    }
  };

  const handleSaveQuestion = async (payload) => {
    try {
      if (editingQuestion) {
        await apiClient.put(`/api/v1/questions/${editingQuestion._id}`, payload);
      } else {
        await apiClient.post('/api/v1/questions/add', { ...payload, subject: currentSubject });
      }
      setIsFormOpen(false);
      fetchQuestions();
    } catch (err) {
      alert("Failed to save question.");
      console.error(err);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading questions...</div>;

  return (
    <div className="p-4 sm:p-8 bg-muted/40 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 border-b pb-4">Exam Question Management</h1>
        <SubjectSection subject="Maths" questions={questions.maths} onAdd={handleAddQuestion} onEdit={handleEditQuestion} onDelete={handleDeleteQuestion} />
        <SubjectSection subject="Physics" questions={questions.physics} onAdd={handleAddQuestion} onEdit={handleEditQuestion} onDelete={handleDeleteQuestion} />
        <SubjectSection subject="Chemistry" questions={questions.chemistry} onAdd={handleAddQuestion} onEdit={handleEditQuestion} onDelete={handleDeleteQuestion} />

        {/* --- FIX 3: Render the Dialog and the QuestionForm here --- */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? 'Edit Question' : `Add New ${currentSubject} Question`}</DialogTitle>
            </DialogHeader>
            <QuestionForm 
              initialData={editingQuestion} 
              onSave={handleSaveQuestion} 
              onCancel={() => setIsFormOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default InstructorExamPage;