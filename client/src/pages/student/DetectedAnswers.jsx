import apiClient from "@/api/axios";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DetectedAnswers = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [detectedAnswers, setDetectedAnswers] = useState([]);

  useEffect(() => {
    const fetchDetectedAnswers = async () => {
      try {
        const res = await apiClient.get(`/examiner/exam/result/${submissionId}`);
        if (res.data.success) {
          setDetectedAnswers(res.data.detectedMarks || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetectedAnswers();
  }, [submissionId]);

  return (
    <div className="max-w-3xl mx-auto mt-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Detected Answers</h1>

      {loading ? (
        <p className="text-center">Detecting answers...</p>
      ) : (
        <>
          <div className="border rounded-md">
            <div className="grid grid-cols-3 font-semibold border-b p-3 text-sm">
              <div>Question</div>
              <div>Selected Option</div>
              <div>Confidence</div>
            </div>

            {detectedAnswers.map((ans, index) => (
              <div key={index} className="grid grid-cols-3 border-b p-3 text-sm">
                <div>{ans.questionNumber}</div>
                <div>{ans.selectedOption || "Unattempted"}</div>
                <div>{ans.confidence?.toFixed(2)}</div>
              </div>
            ))}

            {detectedAnswers.length === 0 && (
              <p className="p-4 text-sm text-center">No answers detected</p>
            )}
          </div>

          <Button
            className="w-full mt-6"
             onClick={() => navigate(`/ai-examiner/result/${submissionId}`)}
          >
            Show Result
          </Button>
        </>
      )}
    </div>
  );
};

export default DetectedAnswers;
