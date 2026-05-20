import { Roadmap } from "../models/roadmap.model.js";
import { generateStudyRoadmap } from "../services/aiService.js";

export const createRoadmap = async (req, res) => {
    try {
        const {
            examType,
            currentMarks,
            sectionWiseMarks,
            targetScore,
            attemptNumber,
            preferences,
            studyStyle
        } = req.body;

        // Validation
        if (!examType || !currentMarks || !sectionWiseMarks || !targetScore || !attemptNumber) {
            return res.status(400).json({
                message: "All required fields must be provided."
            });
        }

        // Validate exam-specific subjects
        if (examType === 'NEET' && !sectionWiseMarks.biology) {
            return res.status(400).json({
                message: "Biology marks are required for NEET."
            });
        }

        if (examType === 'JEE' && !sectionWiseMarks.mathematics) {
            return res.status(400).json({
                message: "Mathematics marks are required for JEE."
            });
        }

        // Mark previous roadmaps as inactive
        await Roadmap.updateMany(
            { student: req.id, isActive: true },
            { isActive: false }
        );

        // Generate AI roadmap
        const aiResponse = await generateStudyRoadmap({
            examType,
            currentMarks,
            sectionWiseMarks,
            targetScore,
            attemptNumber,
            preferences: preferences || [],
            studyStyle: studyStyle || []
        });

        if (!aiResponse.success) {
            return res.status(500).json({
                message: aiResponse.error || "Failed to generate roadmap."
            });
        }

        // Create roadmap in database
        const roadmap = await Roadmap.create({
            student: req.id,
            examType,
            currentMarks,
            sectionWiseMarks,
            targetScore,
            attemptNumber,
            preferences: preferences || [],
            studyStyle: studyStyle || [],
            aiGeneratedRoadmap: aiResponse.roadmap,
            isActive: true
        });

        return res.status(201).json({
            success: true,
            roadmap,
            message: "Roadmap generated successfully!"
        });

    } catch (error) {
        console.error('Create Roadmap Error:', error);
        return res.status(500).json({
            message: "Failed to create roadmap."
        });
    }
};

export const getActiveRoadmap = async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({
            student: req.id,
            isActive: true
        }).sort({ createdAt: -1 });

        if (!roadmap) {
            return res.status(404).json({
                message: "No active roadmap found."
            });
        }

        return res.status(200).json({
            success: true,
            roadmap
        });

    } catch (error) {
        console.error('Get Active Roadmap Error:', error);
        return res.status(500).json({
            message: "Failed to fetch roadmap."
        });
    }
};

export const getRoadmapHistory = async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({
            student: req.id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            roadmaps
        });

    } catch (error) {
        console.error('Get Roadmap History Error:', error);
        return res.status(500).json({
            message: "Failed to fetch roadmap history."
        });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const { roadmapId } = req.params;
        const { subject, topic, notes } = req.body;

        if (!subject || !topic) {
            return res.status(400).json({
                message: "Subject and topic are required."
            });
        }

        const roadmap = await Roadmap.findOne({
            _id: roadmapId,
            student: req.id
        });

        if (!roadmap) {
            return res.status(404).json({
                message: "Roadmap not found."
            });
        }

        // Add progress entry
        roadmap.progressTracking.push({
            subject,
            topic,
            completedAt: new Date(),
            notes: notes || ""
        });

        await roadmap.save();

        return res.status(200).json({
            success: true,
            roadmap,
            message: "Progress updated successfully!"
        });

    } catch (error) {
        console.error('Update Progress Error:', error);
        return res.status(500).json({
            message: "Failed to update progress."
        });
    }
};

export const deleteRoadmap = async (req, res) => {
    try {
        const { roadmapId } = req.params;

        const roadmap = await Roadmap.findOneAndDelete({
            _id: roadmapId,
            student: req.id
        });

        if (!roadmap) {
            return res.status(404).json({
                message: "Roadmap not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Roadmap deleted successfully."
        });

    } catch (error) {
        console.error('Delete Roadmap Error:', error);
        return res.status(500).json({
            message: "Failed to delete roadmap."
        });
    }
};