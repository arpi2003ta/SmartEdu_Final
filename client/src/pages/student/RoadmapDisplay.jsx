import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Clock, TrendingUp, BookOpen, CheckCircle2, History, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoadmapDisplay = ({ roadmap, onGenerateNew }) => {
    const navigate = useNavigate();
    const { aiGeneratedRoadmap } = roadmap;

    return (
        <div className="bg-gray-50 dark:bg-[#141414] min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Your Personalized Study Roadmap
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {roadmap.examType} Exam • Target: {roadmap.targetScore} marks
                    </p>
                    <div className="flex justify-center gap-4 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/ai-roadmap/track-progress")}
                        >
                            <BarChart className="mr-2 h-4 w-4" />
                            Track Progress
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/ai-roadmap/history")}
                        >
                            <History className="mr-2 h-4 w-4" />
                            View History
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onGenerateNew}
                        >
                            Generate New
                        </Button>
                    </div>
                </div>

                {/* Subject Priority */}                {/* Subject Priority */}
                <Card className="mb-6 dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center dark:text-white">
                            <Target className="mr-2 h-5 w-5 text-blue-600" />
                            Subject Priority Order
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {aiGeneratedRoadmap?.subjectPriority?.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                            {item.priority}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg dark:text-white">{item.subject}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mt-1">{item.focus}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Study Time Allocation */}
                <Card className="mb-6 dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center dark:text-white">
                            <Clock className="mr-2 h-5 w-5 text-green-600" />
                            Study Time Allocation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {aiGeneratedRoadmap?.studyTimeAllocation?.map((item, idx) => (
                                <div key={idx} className="p-4 border-l-4 border-green-600 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold dark:text-white">{item.subject}</h3>
                                        <span className="text-green-600 dark:text-green-400 font-semibold">
                                            {item.hoursPerDay} hrs/day
                                        </span>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                        {item.activities?.map((activity, i) => (
                                            <li key={i}>{activity}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Weekly Focus Cycle */}
                <Card className="mb-6 dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center dark:text-white">
                            <BookOpen className="mr-2 h-5 w-5 text-purple-600" />
                            Weekly Focus Cycle
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {aiGeneratedRoadmap?.weeklyFocusCycle?.map((week, idx) => (
                                <div key={idx} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2">
                                        {week.weeks}
                                    </h3>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                        {week.focus?.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Milestone Goals */}
                <Card className="mb-6 dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center dark:text-white">
                            <TrendingUp className="mr-2 h-5 w-5 text-orange-600" />
                            Milestone Goals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {aiGeneratedRoadmap?.milestoneGoals?.map((milestone, idx) => (
                                <div
                                    key={idx}
                                    className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg text-center"
                                >
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {milestone.timeline}
                                    </p>
                                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                        {milestone.targetScore}+
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">marks</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Recommendations */}
                {aiGeneratedRoadmap?.additionalRecommendations?.length > 0 && (
                    <Card className="dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="dark:text-white">Additional Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {aiGeneratedRoadmap.additionalRecommendations.map((rec, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                    >
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Completed Progress */}
                {roadmap.progressTracking?.length > 0 && (
                    <Card className="mt-6 dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="dark:text-white">Your Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {roadmap.progressTracking.map((progress, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-3"
                                    >
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        <div>
                                            <p className="font-semibold dark:text-white">
                                                {progress.subject}: {progress.topic}
                                            </p>
                                            {progress.notes && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {progress.notes}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                {new Date(progress.completedAt).toLocaleDateString()}
                                            </p>
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

export default RoadmapDisplay;