import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const QuestionForm = ({ initialData, onSave, onCancel }) => {
  const [questionType, setQuestionType] = useState('MCQ');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState('');

  
  useEffect(() => {
    if (initialData) {
      setQuestionType(initialData.questionType);
      setQuestionText(initialData.question);
      if (initialData.questionType === 'MCQ') {
        setOptions(initialData.options.map(opt => opt.optionText));
        setCorrectOptionIndex(initialData.options.findIndex(opt => opt.isCorrect));
      } else {
        setCorrectAnswer(initialData.correctAnswer?.toString() || '');
      }
    } else {
      
      setQuestionType('MCQ');
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectOptionIndex(null);
      setCorrectAnswer('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let payload = {
      question: questionText,
      questionType: questionType,
    };

    if (questionType === 'MCQ') {
      if (correctOptionIndex === null || options.some(opt => !opt.trim())) {
        return alert('Please fill all options and select a correct answer.');
      }
      payload.options = options.map((opt, index) => ({
        optionText: opt,
        isCorrect: index === correctOptionIndex,
      }));
      payload.negativeMarks = -1;
    } else { 
      
      if (!correctAnswer.trim()) {
        return alert('Please provide the correct numerical answer.');
      }
      payload.correctAnswer = parseFloat(correctAnswer); 
      payload.negativeMarks = 0; 
    }

    onSave(payload); 
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 pt-4">
      <div>
        <Label className="font-semibold">Question Type</Label>
        <Select value={questionType} onValueChange={setQuestionType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="MCQ">Multiple Choice (MCQ)</SelectItem>
            <SelectItem value="Integer">Integer / Numerical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="questionText" className="font-semibold">Question Text</Label>
        <Input id="questionText" value={questionText} onChange={(e) => setQuestionText(e.target.value)} required />
      </div>
      {questionType === 'MCQ' ? (
        <div>
          <Label className="font-semibold">Options & Correct Answer</Label>
          <RadioGroup onValueChange={(value) => setCorrectOptionIndex(parseInt(value))} value={correctOptionIndex?.toString()}>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-3 my-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Input value={option} onChange={(e) => setOptions(prev => { const newOpts = [...prev]; newOpts[index] = e.target.value; return newOpts; })} required />
              </div>
            ))}
          </RadioGroup>
        </div>
      ) : (
        <div>
          <Label htmlFor="correctAnswer" className="font-semibold">Correct Numerical Answer</Label>
          <Input id="correctAnswer" type="number" step="any" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} required />
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update' : 'Save'} Question</Button>
      </div>
    </form>
  );
};

export default QuestionForm;