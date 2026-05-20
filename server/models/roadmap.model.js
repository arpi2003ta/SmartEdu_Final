import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    examType: {
        type: String,
        enum: ['JEE', 'NEET'],
        required: true
    },
    currentMarks: {
        type: Number,
        required: true
    },
    sectionWiseMarks: {
        physics: { type: Number, required: true },
        chemistry: { type: Number, required: true },
        biology: { type: Number, default: 0 }, // Only for NEET
        mathematics: { type: Number, default: 0 } // Only for JEE
    },
    targetScore: {
        type: Number,
        required: true
    },
    attemptNumber: {
        type: Number,
        required: true,
        min: 1
    },
    preferences: [{
        type: String
    }],
    studyStyle: [{
        type: String,
        enum: ['Morning', 'Afternoon', 'Evening', 'Night']
    }],
    aiGeneratedRoadmap: {
        subjectPriority: [{
            subject: String,
            priority: Number,
            focus: String
        }],
        studyTimeAllocation: [{
            subject: String,
            hoursPerDay: Number,
            activities: [String]
        }],
        weeklyFocusCycle: [{
            weeks: String,
            focus: [String]
        }],
        milestoneGoals: [{
            timeline: String,
            targetScore: Number
        }],
        additionalRecommendations: [String]
    },
    progressTracking: [{
        subject: String,
        topic: String,
        completedAt: Date,
        notes: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Index for faster queries
roadmapSchema.index({ student: 1, createdAt: -1 });
roadmapSchema.index({ student: 1, isActive: 1 });

export const Roadmap = mongoose.model("Roadmap", roadmapSchema);