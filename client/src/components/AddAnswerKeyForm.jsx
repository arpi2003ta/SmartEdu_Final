import React, { useState } from "react"; 
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AddAnswerKeyForm = ({ onSave, onCancel }) => {
  const [questionNumber, setQuestionNumber] = useState("");
  const [option, setOption] = useState("");

  const handleSave = () => {
    if (!questionNumber || !option) {
      toast.error("Please fill out both fields.");
      return;
    }
    
    onSave(); 
  };

  return (
    <div className="my-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Answer Key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="questionNumber">Question Number</Label>
            <Input
              id="questionNumber"
              type="number"
              placeholder="e.g., 1"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="options">Correct Option</Label>
            <Input
              id="options"
              type="text"
              placeholder="e.g., A"
              value={option}
              onChange={(e) => setOption(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Answer Key</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddAnswerKeyForm;