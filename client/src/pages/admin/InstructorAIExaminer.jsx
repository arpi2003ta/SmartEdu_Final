import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/api/axios";

const InstructorAIExaminer = () => {
  const [neetQuestions, setNeetQuestions]=useState(null);
  const [uploaded, setUploaded]=useState(false);
  const [answetKeyFile, setAnswerKeyFile]= useState(null);
  const [blankOmr, setBlankOmr]=useState(null);
  const [name, setName]=useState("NEET");
  const handleAnswerKeyUpload = (e)=>{
    if(e.target.files && e.target.files.length>0){
      setAnswerKeyFile(e.target.files[0]);
    }
  }
  
  const handleQuestionUpload=(e)=>{
    if(e.target.files && e.target.files.length>0){
      setNeetQuestions(e.target.files[0]);
    }
  }

  const handleBlankOmrUpload=(e)=>{
    if(e.target.files && e.target.files.length>0){
      setBlankOmr(e.target.files[0]);
    }
  }

  const handleSubmit = async()=>{
    try{
      if(!answetKeyFile && !blankOmr && !neetQuestions){
        return toast.error("Please upload something");
      }

      const formData = new FormData();
      
      formData.append("name",name);
      if(neetQuestions) formData.append("questions", neetQuestions);
      if(answetKeyFile) formData.append("answerKey", answetKeyFile);
      if(blankOmr) formData.append("omr", blankOmr);

      const response = await apiClient.post("/examiner/exam/upload", formData);

      if(response.data.success){
        toast.success(response.data.message);
      }

    }catch(err){
      toast.error(err.response?.data?.message || "Failed to upload")
    }
  }


  return (
    <div className="max-w-3xl mx-auto px-4 my-10">


      {/* Upload Card (always visible) */}
      <div className="my-8">
        <Card>
          <CardHeader>
            <CardTitle>NEET Question</CardTitle>
            <CardDescription>
              Upload the Neet question paper
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="neetQuestions">Upload NEET Questions</Label>
              <Input
                id="neetQuestions"
                type="file"
                accept="application/pdf"
                onChange={handleQuestionUpload}
                disabled={uploaded}
              />
              {neetQuestions && (
                <p className="text-sm text-muted-foreground">
                  Selected: {neetQuestions.name}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="answer-key">Upload Your Answer Key</Label>
              <Input id="answer-key" type="file" accept="image/" onChange={handleAnswerKeyUpload} disabled={uploaded} />
              {answetKeyFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {answetKeyFile.name}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="blank-omr">Upload Blank OMR</Label>
              <Input id="blank-omr" type="file" accept="image/" onChange={handleBlankOmrUpload}/>
            </div>
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={handleSubmit}>Upload</Button>
            </div>

          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default InstructorAIExaminer;
