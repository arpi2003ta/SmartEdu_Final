import React from 'react';
import { Button } from '@/components/ui/button';
import QuestionCard from './QuestionCard';

const SubjectSection = ({ subject, questions, onAdd, onEdit, onDelete }) => {
  return (
    <div className="mb-10 p-6 bg-card rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary">{subject} ({questions.length} Questions)</h2>
        <Button onClick={() => onAdd(subject)}>Add New Question</Button>
      </div>
      
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionCard 
              key={q._id} 
              question={q} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          No questions found for this subject.
        </p>
      )}
    </div>
  );
};

export default SubjectSection;