import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DarkMode from "@/DarkMode";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import apiClient from "@/api/axios";


export const StepIndicator=()=>{
    return(
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto mt-4 mb-8 px-4">
            <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-10 h-10 border-2 border-primary rounded-full text-lg font-bold text-primary">
                    1
                </div>
                <p className="mt-2 text-sm font-medium">Select Institute</p>
            </div>
            <div className="flex-1 h-0.5 mb-5 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-10 h-10 border-2 border-primary rounded-full text-lg font-bold text-primary">
                    2
                </div>
                <p className="mt-2 text-sm font-medium">Select Exam Details</p>
            </div>
            <div className="flex-1 h-0.5 mb-5 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-10 h-10 border-2 border-primary rounded-full text-lg font-bold text-primary">
                    3
                </div>
                <p className="mt-2 text-sm font-medium">Enter Rank Range</p>
            </div>
            
        </div>
    )
}

export const CollegePredictor=()=>{

    const indianStates = [
    "All-India","Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];
    const categories = ["General","Other Backward Classes-Non Creamy Layer","Scheduled Castes","Scheduled Tribes","General & Person with Disabilities", "Other Backward Classes & Persons with Disabilitities", "Scheduled Castes & Persons with Disabilities","Scheduled Tribes & Persons with Disabilities","General & Economically Weaker Section","General & Economically Weaker Section & Persons with Disability"];
    const FetchedData = {College: "IIT Bombay", Degree:"B.Tech", Course:"Computer Science and Engineering"}
    const rounds =["One","Two","Three","Four","Five","Six","Seven"];
    const [institute, setInstitute]=useState("");
    const [category, setCategory]=useState("");
    const [quota, setQuota]=useState("");
    const [gender, setGender]=useState("")
    const [round, setRound]=useState("");
    const [marks, setMarks]=useState("");
    const [rank, setRank]=useState("");

    const handleSubmit=async ()=>{
        try{
            const response= await apiClient.post(`/predict`,{quota:quota, pool:gender, category:category, user_rank:rank});
            toast.success("Data sent!");
        }catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || err.message);
        }
    }
    return (
        <>
        <div className="container mx-auto max-w-5xl py-2 px-4">
            <Card className={"shadow-lg"}>
                <CardHeader className={"text-center"}>
                    <CardTitle className={"text-3xl font-bold "}>
                        Your College Predictor
                    </CardTitle>
                    <CardDescription>
                        <StepIndicator/>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6 pb-16">
                        <h3 className="text-xl font-semibold border-b pb-2">Step 1: Select Institute</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="institute" className={"pb-2"}>Institute Type</Label>
                                
                                <Select name="Institue" value={institute} onValueChange={setInstitute}>
                                    <SelectTrigger className={"text-base min-w-40 md:min-w-96"}>
                                        <SelectValue placeholder="Choose Your Institute"/>
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem value="IIT">IIT</SelectItem>
                                        <SelectItem value="NIT">NIT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pb-16">
                        <h3 className="text-xl font-semibold border-b pb-2">Step 2: Select Exam Details</h3>
                        <div className="flex justify-between pl-5 pr-5">
                            <div className="">
                                <div>
                                    <Label htmlFor="category" className={"pb-2"}>Your Category</Label>
                                    <Select name="category" value={category} onValueChange={setCategory}>
                                        <SelectTrigger id="category" className={"text-base min-w-40 md:min-w-96"}>
                                            <SelectValue placeholder="Select Your Category"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat)=>(<SelectItem key={cat} value={cat} className={"text-base"}>{cat}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="">
                                <div>
                                    <Label htmlFor="quota" className={"pb-2"}>Your Quota</Label>
                                    <Select name="quota" value={quota} onValueChange={setQuota}>
                                        <SelectTrigger id="quota" className={"text-base min-w-40 md:min-w-96"}>
                                            <SelectValue placeholder="Select your Home-State"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {indianStates.map((state)=>(
                                                <SelectItem key={state} value={state} className={"text-base"}>{state}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between pl-5 pr-5">
                            <div>
                                <Label htmlFor="gender" className={"pb-2"}>Gender/Pool</Label>
                                <Select name="gender" value={gender} onValueChange={setGender}>
                                    <SelectTrigger id="gender" className={"text-base min-w-40 md:min-w-96"}>
                                        <SelectValue placeholder="Select Your Gender"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="neutral">Neutral</SelectItem>
                                        <SelectItem value="female only">Female Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="round" className={"pb-2"}>Preferred Round Number</Label>
                                <Select name="round" value={round} onValueChange={setRound}>
                                    <SelectTrigger id="round" className={"text-base min-w-40 md:min-w-96 "}>
                                        <SelectValue placeholder="preferred Round Number"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rounds.map((round)=>(
                                            <SelectItem key={round} value={round} className="text-base">{round}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 pb-16">
                        <h3 className="text-xl font-semibold border-b pb-2">Step 3: Enter Score</h3>
                        <div className="flex justify-between pl-10 pr-10">
                            <div>
                                <Label htmlFor="marks" className={"pb-2"}>Your Marks</Label>
                                <Input id="marks" type="number" value={marks} onChange={(e)=> setMarks(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="rank" className={"pb-2"}>Your Rank</Label>
                                <Input id="rank" type="number" value={rank} onChange={(e)=>setRank(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center pb-16">
                        <Button onClick={handleSubmit}>Tap To Predict College</Button>
                    </div>
                    {FetchedData &&(
                        <Card className={"bg-green-100 dark:bg-green-900"} >
                            <CardHeader className={"text-center text-xl text-green-800 dark:text-green-200 "}>
                                <CardTitle>Prediction Result:</CardTitle>
                            </CardHeader>
                            <CardContent className={"text-center"}>
                                <div className="text-green-700 dark:text-green-300 text-lg">College: {FetchedData.College}, Degree:  {FetchedData.Degree},Course: {FetchedData.Course}</div>
                            </CardContent>
                            <CardFooter className={" flex justify-center text-md text-gray-600 dark:text-gray-400"}><div className="">Thank you, Hope this will match your requirement !!!</div></CardFooter>
                        </Card>
                    )}
                    
                </CardContent>
                
            </Card>
        </div>
        </>
    )
}
