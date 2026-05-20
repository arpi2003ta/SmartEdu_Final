import mongoose from "mongoose";
import { Course } from "./models/course.model.js";
import { User } from "./models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const createDummyCourse = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        let instructor = await User.findOne({ role: "instructor" });
        if (!instructor) {
            instructor = await User.findOne(); // Fallback to any user
        }

        if (!instructor) {
            console.log("No users found in database. Please register a user first.");
            return;
        }

        const dummyCourse = await Course.create({
            courseTitle: "PHYSICS",
            subTitle: "Learn PHYSICS from scratch",
            description: "A comprehensive guide to PHYSICS",
            category: "Physics",
            courseLevel: "ADVANCED",
            coursePrice: 499,
            creator: instructor._id,
            isPublished: true
        });

        console.log("Created dummy course:", dummyCourse.courseTitle);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

createDummyCourse();
