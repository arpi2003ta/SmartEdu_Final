import React from 'react';
import { Button } from '@/components/ui/button';

const QuestionCard = ({ question, onEdit, onDelete }) => {
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="border bg-card text-card-foreground rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <p className="font-semibold text-lg pr-4">{question.question}</p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={() => onEdit(question._id)}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(question._id)}>Delete</Button>
        </div>
      </div>
      
      {question.questionType === 'MCQ' ? (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div 
              key={index} 
              className={`text-sm p-2 rounded-md ${
                option.isCorrect 
                  ? 'bg-green-100 dark:bg-green-900 font-semibold' 
                  : 'bg-muted'
              }`}
            >
              <span className="font-mono mr-2">{optionLetters[index]}:</span>
              <span>{option.optionText}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2 pt-2 border-t">
          <p className="text-sm font-medium">
            Correct Answer: <span className="font-bold text-green-600">{question.correctAnswer}</span>
          </p>
        </div>
      )}
      
    </div>
  );
};

export default QuestionCard;