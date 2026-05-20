import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectOption } from "@/components/ui/select2";
import { useGetActiveRoadmapQuery, useUpdateProgressMutation } from "@/features/api/roadmapApi";
import { CheckCircle2, ArrowLeft, BookOpen, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrackProgress = () => {
    const navigate = useNavigate();
    const { data: activeRoadmapData, isLoading } = useGetActiveRoadmapQuery();
    const [updateProgress, { isLoading: isUpdating }] = useUpdateProgressMutation();
    
    const [progressForm, setProgressForm] = useState({
        subject: "",
        topic: "",
        notes: ""
    });

    const roadmap = activeRoadmapData?.roadmap;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProgress({
                roadmapId: roadmap._id,
                progressData: progressForm
            }).unwrap();
            alert("Progress updated successfully!");
            setProgressForm({ subject: "", topic: "", notes: "" });
        } catch (error) {
            alert("Failed to update progress");
        }
    };

    if (isLoading) {
        return (
            <div className="bg-gray-50 dark:bg-[#141414] min-h-screen py-12 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
        );
    }

    if (!roadmap) {
        return (
            <div className="bg-gray-50 dark:bg-[#141414] min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="dark:bg-gray-800">
                        <CardContent className="p-12 text-center">
                            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h2 className="text-2xl font-bold dark:text-white mb-2">No Active Roadmap</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                You need to generate a roadmap first before tracking progress.
                            </p>
                            <Button onClick={() => navigate("/ai-roadmap")}>
                                Generate Roadmap
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const subjects = roadmap.examType === "NEET" 
        ? ["Physics", "Chemistry", "Biology"]
        : ["Physics", "Chemistry", "Mathematics"];

    return (
        <div className="bg-gray-50 dark:bg-[#141414] min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/ai-roadmap")}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Roadmap
                    </Button>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Track Your Progress
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {roadmap.examType} Exam Preparation • Target: {roadmap.targetScore} marks
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Add New Progress */}
                    <Card className="dark:bg-gray-800 h-fit">
                        <CardHeader>
                            <CardTitle className="dark:text-white">Add Progress Entry</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="subject">Subject *</Label>
                                    <Select
                                        id="subject"
                                        value={progressForm.subject}
                                        onChange={(e) => setProgressForm({ ...progressForm, subject: e.target.value })}
                                        required
                                    >
                                        <SelectOption value="">Select Subject</SelectOption>
                                        {subjects.map((subject) => (
                                            <SelectOption key={subject} value={subject}>
                                                {subject}
                                            </SelectOption>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="topic">Topic Completed *</Label>
                                    <Input
                                        id="topic"
                                        value={progressForm.topic}
                                        onChange={(e) => setProgressForm({ ...progressForm, topic: e.target.value })}
                                        placeholder="e.g., Newton's Laws of Motion"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="notes">Notes (Optional)</Label>
                                    <Input
                                        id="notes"
                                        value={progressForm.notes}
                                        onChange={(e) => setProgressForm({ ...progressForm, notes: e.target.value })}
                                        placeholder="Any additional notes or observations"
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isUpdating}>
                                    {isUpdating ? "Saving..." : "Save Progress"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Progress Summary */}
                    <Card className="dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="dark:text-white">Progress Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {subjects.map((subject) => {
                                    const completedTopics = roadmap.progressTracking?.filter(
                                        (p) => p.subject === subject
                                    ).length || 0;
                                    
                                    return (
                                        <div key={subject} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold dark:text-white">{subject}</h3>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {completedTopics} topics completed
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Progress</p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {roadmap.progressTracking?.length || 0} Topics
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Progress */}
                {roadmap.progressTracking?.length > 0 && (
                    <Card className="mt-6 dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="dark:text-white">Recent Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[...roadmap.progressTracking]
                                    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                                    .map((progress, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-start gap-3"
                                        >
                                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold dark:text-white">
                                                            {progress.subject}: {progress.topic}
                                                        </p>
                                                        {progress.notes && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                {progress.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(progress.completedAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default TrackProgress;