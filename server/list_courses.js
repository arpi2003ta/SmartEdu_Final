import mongoose from "mongoose";
import { Course } from "./models/course.model.js";
import dotenv from "dotenv";

dotenv.config();

const listCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const courses = await Course.find();
        if (courses.length === 0) {
            console.log("No courses found at all.");
        } else {
            console.log("All courses:");
            courses.forEach(c => console.log(`- ${c.courseTitle} (${c.category}) [Published: ${c.isPublished}]`));
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

listCourses();
