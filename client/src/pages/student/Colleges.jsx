import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Colleges = () => {
  const [marks, setMarks] = useState("");
  const [expectedRank, setExpectedRank] = useState(null);
  const [showPredictions, setShowPredictions] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    gender: "",
    rank: "",
    collegeType: "",
    state: "",
    round: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRankChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      rank: e.target.value,
    }));
  };

  const handleCalculate = () => {
    const expected = parseInt(marks) + 500;
    setExpectedRank(expected);
  };

  const handlePredict = () => {
    const { category, gender, rank, collegeType, state, round } = formData;
    if (category && gender && rank && collegeType && state && round) {
      setShowPredictions(true);
    } else {
        toast.error("Please fill all fields to predict colleges.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 my-10 space-y-6">
      {/* Quick Rank Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Rank Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="marks">Enter Your Marks</Label>
            <Input
              id="marks"
              type="number"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              placeholder="Enter your marks"
            />
          </div>
          <Button onClick={handleCalculate}>Calculate Expected Rank</Button>
        </CardContent>
        {expectedRank !== null && (
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Expected Rank: <strong>{expectedRank}</strong>
            </p>
          </CardFooter>
        )}
      </Card>

      {/* Bottom Section: Student Details & Predicted Colleges */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Student Details Card */}
        <Card className="w-full lg:w-1/2">
          <CardHeader>
            <CardTitle>Student Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Category</Label>
              <Select onValueChange={(val) => handleChange("category", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="obc">OBC</SelectItem>
                  <SelectItem value="sc">SC</SelectItem>
                  <SelectItem value="st">ST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Gender</Label>
              <Select onValueChange={(val) => handleChange("gender", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Rank</Label>
              <Input
                type="number"
                placeholder="Enter your rank"
                value={formData.rank}
                onChange={handleRankChange}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <div>Preferred Branches</div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Checkbox id="mbbs" />
                  <Label htmlFor="mbbs">MBBS</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <Checkbox id="bds" />
                  <Label htmlFor="bds">BDS</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>College Type</Label>
              <Select onValueChange={(val) => handleChange("collegeType", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select college type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="govt">Government</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="deemed">Deemed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>State</Label>
              <Select onValueChange={(val) => handleChange("state", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="west-bengal">West Bengal</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Round</Label>
              <Select onValueChange={(val) => handleChange("round", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select round" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Round 1</SelectItem>
                  <SelectItem value="2">Round 2</SelectItem>
                  <SelectItem value="3">Round 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handlePredict}>Predict College</Button>
          </CardContent>
        </Card>

        {/* Predicted Colleges Card */}
        <Card
          className={`w-full lg:w-1/2 ${
            showPredictions ? "max-h-[650px]" : "max-h-[100px]"
          } py-2`}
        >
          <CardHeader>
            <CardTitle>Predicted Colleges</CardTitle>
          </CardHeader>
          {showPredictions && (
            <CardContent className="grid lg:grid-cols-2 gap-5 overflow-y-auto max-h-[550px]">
              {[1, 2, 3].map((_, idx) => (
                <Card
                  key={idx}
                  className="border border-gray-200 shadow-sm p-4"
                >
                  <CardTitle>College Name {idx + 1}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Location: City {idx + 1}
                  </p>
                  <p className="text-sm">
                    Fees: ₹{(50000 + idx * 10000).toLocaleString()}
                  </p>
                  <Button className="mt-2" variant="outline">
                    Visit Website
                  </Button>
                </Card>
              ))}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Colleges;
