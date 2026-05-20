import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectOption } from "@/components/ui/select2";
import { Button } from "@/components/ui/button";
import { useCreateRoadmapMutation, useGetActiveRoadmapQuery } from "@/features/api/roadmapApi";
import { Loader2 } from "lucide-react";
import RoadmapDisplay from "./RoadmapDisplay";

const AIRoadmap = () => {
    const [forceShowForm, setForceShowForm] = useState(false);
    const [formData, setFormData] = useState({
        examType: "",
        currentMarks: "",
        physics: "",
        chemistry: "",
        biology: "",
        mathematics: "",
        targetScore: "",
        attemptNumber: "",
        preferences: [],
        studyStyle: []
    });

    const [preferenceInput, setPreferenceInput] = useState("");
    const [createRoadmap, { isLoading: isCreating }] = useCreateRoadmapMutation();
    const { data: activeRoadmapData, isLoading: isFetching, refetch } = useGetActiveRoadmapQuery();

    const subjects = formData.examType === "NEET" 
        ? ["Physics", "Chemistry", "Biology"]
        : formData.examType === "JEE"
        ? ["Physics", "Chemistry", "Mathematics"]
        : [];

    const studyTimeOptions = ["Morning", "Afternoon", "Evening", "Night"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            studyStyle: checked
                ? [...prev.studyStyle, value]
                : prev.studyStyle.filter(item => item !== value)
        }));
    };

    const addPreference = () => {
        if (preferenceInput.trim() && !formData.preferences.includes(preferenceInput.trim())) {
            setFormData(prev => ({
                ...prev,
                preferences: [...prev.preferences, preferenceInput.trim()]
            }));
            setPreferenceInput("");
        }
    };

    const removePreference = (pref) => {
        setFormData(prev => ({
            ...prev,
            preferences: prev.preferences.filter(p => p !== pref)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sectionWiseMarks = {
            physics: Number(formData.physics),
            chemistry: Number(formData.chemistry),
            biology: formData.examType === "NEET" ? Number(formData.biology) : 0,
            mathematics: formData.examType === "JEE" ? Number(formData.mathematics) : 0
        };

        const roadmapData = {
            examType: formData.examType,
            currentMarks: Number(formData.currentMarks),
            sectionWiseMarks,
            targetScore: Number(formData.targetScore),
            attemptNumber: Number(formData.attemptNumber),
            preferences: formData.preferences,
            studyStyle: formData.studyStyle
        };

        try {
            await createRoadmap(roadmapData).unwrap();
            alert("Roadmap generated successfully!");
            setForceShowForm(false);
            refetch();
        } catch (error) {
            console.error("Error:", error);
            alert(error?.data?.message || "Failed to generate roadmap. Please try again.");
        }
    };

    const handleGenerateNew = () => {
        setForceShowForm(true);
        setFormData({
            examType: "",
            currentMarks: "",
            physics: "",
            chemistry: "",
            biology: "",
            mathematics: "",
            targetScore: "",
            attemptNumber: "",
            preferences: [],
            studyStyle: []
        });
    };

    // Show existing roadmap if available and form is not forced
    if (activeRoadmapData?.roadmap && !forceShowForm && !isCreating) {
        return <RoadmapDisplay roadmap={activeRoadmapData.roadmap} onGenerateNew={handleGenerateNew} />;
    }

    return (
        <div className="bg-gray-50 dark:bg-[#141414] min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center dark:text-white">
                            AI Study Roadmap Generator
                        </CardTitle>
                        <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
                            Get a personalized study plan powered by AI
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Exam Type */}
                            <div>
                                <Label htmlFor="examType">Exam Type *</Label>
                                <Select
                                    id="examType"
                                    name="examType"
                                    value={formData.examType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <SelectOption value="">Select Exam Type</SelectOption>
                                    <SelectOption value="JEE">JEE</SelectOption>
                                    <SelectOption value="NEET">NEET</SelectOption>
                                </Select>
                            </div>

                            {formData.examType && (
                                <>
                                    {/* Current Marks */}
                                    <div>
                                        <Label htmlFor="currentMarks">
                                            Current Overall Marks * ({formData.examType === "NEET" ? "out of 720" : "out of 300"})
                                        </Label>
                                        <Input
                                            id="currentMarks"
                                            name="currentMarks"
                                            type="number"
                                            value={formData.currentMarks}
                                            onChange={handleInputChange}
                                            placeholder={formData.examType === "NEET" ? "e.g., 450" : "e.g., 150"}
                                            required
                                        />
                                    </div>

                                    {/* Section-wise Marks */}
                                    <div>
                                        <Label className="mb-2 block">Section-wise Breakdown *</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="physics" className="text-xs">Physics</Label>
                                                <Input
                                                    id="physics"
                                                    name="physics"
                                                    type="number"
                                                    value={formData.physics}
                                                    onChange={handleInputChange}
                                                    placeholder="Physics marks"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="chemistry" className="text-xs">Chemistry</Label>
                                                <Input
                                                    id="chemistry"
                                                    name="chemistry"
                                                    type="number"
                                                    value={formData.chemistry}
                                                    onChange={handleInputChange}
                                                    placeholder="Chemistry marks"
                                                    required
                                                />
                                            </div>
                                            {formData.examType === "NEET" ? (
                                                <div>
                                                    <Label htmlFor="biology" className="text-xs">Biology</Label>
                                                    <Input
                                                        id="biology"
                                                        name="biology"
                                                        type="number"
                                                        value={formData.biology}
                                                        onChange={handleInputChange}
                                                        placeholder="Biology marks"
                                                        required
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <Label htmlFor="mathematics" className="text-xs">Mathematics</Label>
                                                    <Input
                                                        id="mathematics"
                                                        name="mathematics"
                                                        type="number"
                                                        value={formData.mathematics}
                                                        onChange={handleInputChange}
                                                        placeholder="Maths marks"
                                                        required
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Target Score */}
                                    <div>
                                        <Label htmlFor="targetScore">Target Score *</Label>
                                        <Input
                                            id="targetScore"
                                            name="targetScore"
                                            type="number"
                                            value={formData.targetScore}
                                            onChange={handleInputChange}
                                            placeholder={formData.examType === "NEET" ? "e.g., 650" : "e.g., 250"}
                                            required
                                        />
                                    </div>

                                    {/* Attempt Number */}
                                    <div>
                                        <Label htmlFor="attemptNumber">Attempt Number *</Label>
                                        <Input
                                            id="attemptNumber"
                                            name="attemptNumber"
                                            type="number"
                                            min="1"
                                            value={formData.attemptNumber}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 1, 2, 3"
                                            required
                                        />
                                    </div>

                                    {/* Preferences */}
                                    <div>
                                        <Label>Favorite Subjects (Optional)</Label>
                                        <div className="flex gap-2 mt-2">
                                            <Input
                                                value={preferenceInput}
                                                onChange={(e) => setPreferenceInput(e.target.value)}
                                                placeholder="Enter subject name"
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference())}
                                            />
                                            <Button type="button" onClick={addPreference} variant="outline">
                                                Add
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {formData.preferences.map((pref, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                                >
                                                    {pref}
                                                    <button
                                                        type="button"
                                                        onClick={() => removePreference(pref)}
                                                        className="hover:text-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Study Style */}
                                    <div>
                                        <Label className="mb-2 block">Preferred Study Times (Select Multiple)</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {studyTimeOptions.map((time) => (
                                                <label
                                                    key={time}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={time}
                                                        checked={formData.studyStyle.includes(time)}
                                                        onChange={handleCheckboxChange}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="dark:text-gray-300">{time}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isCreating}
                                    >
                                        {isCreating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Generating Roadmap...
                                            </>
                                        ) : (
                                            "Generate AI Roadmap"
                                        )}
                                    </Button>
                                </>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AIRoadmap;