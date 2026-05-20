import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetRoadmapHistoryQuery, useDeleteRoadmapMutation } from "@/features/api/roadmapApi";
import { ArrowLeft, Calendar, Target, TrendingUp, Trash2, Eye, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoadmapHistory = () => {
    const navigate = useNavigate();
    const { data: historyData, isLoading } = useGetRoadmapHistoryQuery();
    const [deleteRoadmap] = useDeleteRoadmapMutation();
    const [expandedRoadmap, setExpandedRoadmap] = useState(null);

    const handleDelete = async (roadmapId) => {
        if (window.confirm("Are you sure you want to delete this roadmap?")) {
            try {
                await deleteRoadmap(roadmapId).unwrap();
                alert("Roadmap deleted successfully!");
            } catch (error) {
                alert("Failed to delete roadmap");
            }
        }
    };

    const toggleExpand = (roadmapId) => {
        setExpandedRoadmap(expandedRoadmap === roadmapId ? null : roadmapId);
    };

    if (isLoading) {
        return (
            <div className="bg-gray-50 dark:bg-[#141414] min-h-screen py-12 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Loading history...</p>
            </div>
        );
    }

    const roadmaps = historyData?.roadmaps || [];

    return (
        <div className="bg-gray-50 dark:bg-[#141414] min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        Roadmap History
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View all your previously generated roadmaps
                    </p>
                </div>

                {roadmaps.length === 0 ? (
                    <Card className="dark:bg-gray-800">
                        <CardContent className="p-12 text-center">
                            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h2 className="text-2xl font-bold dark:text-white mb-2">No History Yet</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Generate your first roadmap to see it here.
                            </p>
                            <Button onClick={() => navigate("/ai-roadmap")}>
                                Generate Roadmap
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {roadmaps.map((roadmap) => (
                            <Card key={roadmap._id} className="dark:bg-gray-800">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CardTitle className="dark:text-white">
                                                    {roadmap.examType} Roadmap
                                                </CardTitle>
                                                {roadmap.isActive && (
                                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    Created: {new Date(roadmap.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Target className="h-4 w-4" />
                                                    Attempt: {roadmap.attemptNumber}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleExpand(roadmap._id)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                {expandedRoadmap === roadmap._id ? "Hide" : "View"}
                                            </Button>
                                            {!roadmap.isActive && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(roadmap._id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Summary Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Current Score</p>
                                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                {roadmap.currentMarks}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Target Score</p>
                                            <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                                {roadmap.targetScore}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Gap</p>
                                            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                                                +{roadmap.targetScore - roadmap.currentMarks}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Progress</p>
                                            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                                {roadmap.progressTracking?.length || 0}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Section-wise Marks */}
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold dark:text-white mb-2">Section-wise Marks:</p>
                                        <div className="flex flex-wrap gap-3">
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm dark:text-gray-300">
                                                Physics: {roadmap.sectionWiseMarks.physics}
                                            </span>
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm dark:text-gray-300">
                                                Chemistry: {roadmap.sectionWiseMarks.chemistry}
                                            </span>
                                            {roadmap.examType === "NEET" ? (
                                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm dark:text-gray-300">
                                                    Biology: {roadmap.sectionWiseMarks.biology}
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm dark:text-gray-300">
                                                    Mathematics: {roadmap.sectionWiseMarks.mathematics}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Study Preferences */}
                                    {roadmap.preferences?.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm font-semibold dark:text-white mb-2">Favorite Subjects:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {roadmap.preferences.map((pref, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                                                    >
                                                        {pref}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {roadmap.studyStyle?.length > 0 && (
                                        <div>
                                            <p className="text-sm font-semibold dark:text-white mb-2">Study Times:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {roadmap.studyStyle.map((style, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                                                    >
                                                        {style}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Expanded Details */}
                                    {expandedRoadmap === roadmap._id && (
                                        <div className="mt-6 pt-6 border-t dark:border-gray-700 space-y-6">
                                            {/* Subject Priority */}
                                            <div>
                                                <h3 className="font-bold text-lg dark:text-white mb-3 flex items-center gap-2">
                                                    <Target className="h-5 w-5 text-blue-600" />
                                                    Subject Priority
                                                </h3>
                                                <div className="space-y-3">
                                                    {roadmap.aiGeneratedRoadmap?.subjectPriority?.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                                        >
                                                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                                {item.priority}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold dark:text-white">{item.subject}</p>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.focus}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Milestone Goals */}
                                            <div>
                                                <h3 className="font-bold text-lg dark:text-white mb-3 flex items-center gap-2">
                                                    <TrendingUp className="h-5 w-5 text-orange-600" />
                                                    Milestone Goals
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    {roadmap.aiGeneratedRoadmap?.milestoneGoals?.map((milestone, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center"
                                                        >
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                                {milestone.timeline}
                                                            </p>
                                                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                                {milestone.targetScore}+
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoadmapHistory;