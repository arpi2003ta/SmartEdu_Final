import { Result } from "../models/result.model.js";
import { Response } from "../models/response.model.js";
import { Question } from "../models/question.model.js";

export const calculateAndSaveResult = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.user._id;

    const studentAttempt = await Response.findById(attemptId).populate('answers.questionId');
    if (!studentAttempt) {
      return res.status(404).json({ message: "Attempt not found." });
    }

    let totalScore = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    
    const subjectScores = { Maths: 0, Physics: 0, Chemistry: 0 };
    const subjectTimes = { Maths: 0, Physics: 0, Chemistry: 0 };
    
    for (const studentAnswer of studentAttempt.answers) {
      const question = studentAnswer.questionId;
      if (!question) continue;

      subjectTimes[question.subject] += studentAnswer.timeSpent || 0;
      
      let isAnswerCorrect = false;

      
      if (question.questionType === 'Integer') {

        if (parseFloat(studentAnswer.selectedOption) === question.correctAnswer) {
          isAnswerCorrect = true;
        }
      } else { 
        const correctOptionIndex = question.options.findIndex(opt => opt.isCorrect);
        if (parseInt(studentAnswer.selectedOption) === correctOptionIndex) {
          isAnswerCorrect = true;
        }
      }

      if (isAnswerCorrect) {
        totalScore += question.marks;
        subjectScores[question.subject] += question.marks;
        totalCorrect++;
      } else {
        totalScore += question.negativeMarks;
        subjectScores[question.subject] += question.negativeMarks;
        totalIncorrect++;
      }
    }
    
    const totalQuestions = await Question.countDocuments();
    const totalUnattempted = totalQuestions - studentAttempt.answers.length;

    const finalResult = await Result.create({
      attemptId,
      studentId,
      score: totalScore,
      correctCount: totalCorrect,
      incorrectCount: totalIncorrect,
      unattemptedCount: totalUnattempted,
      subjectWiseScore: [
        { subject: 'Maths', Score: subjectScores.Maths },
        { subject: 'Physics', Score: subjectScores.Physics },
        { subject: 'Chemistry', Score: subjectScores.Chemistry },
      ],
      subjectWiseTimeSpent: [
        { subject: 'Maths', timeSpent: subjectTimes.Maths },
        { subject: 'Physics', timeSpent: subjectTimes.Physics },
        { subject: 'Chemistry', timeSpent: subjectTimes.Chemistry },
      ]
    });

    res.status(201).json({ message: "Result calculated successfully.", result: finalResult });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};