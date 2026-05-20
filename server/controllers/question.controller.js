import { Question } from "../models/question.model.js";


export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const { question, questionType, options, correctAnswer, subject, marks, negativeMarks } = req.body;

    
    const newQuestionData = {
      question,
      questionType,
      subject,
      marks,
      negativeMarks,
    };

    if (questionType === 'Integer') {
      newQuestionData.correctAnswer = correctAnswer;
      newQuestionData.options = undefined; 

    } else { 
      newQuestionData.options = options;
      newQuestionData.correctAnswer = undefined;
    }

    const createdQuestion = await Question.create(newQuestionData);

    res.status(200).json({ message: "Question added successfully", question: createdQuestion });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const updateData = req.body;

    if (updateData.questionType === 'Integer') {
      updateData.$unset = { options: 1 }; 
      updateData.options = undefined;
    } else if (updateData.questionType === 'MCQ') {
      updateData.$unset = { correctAnswer: 1 }; 
      updateData.correctAnswer = undefined;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question updated successfully", question: updatedQuestion });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
