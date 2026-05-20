import mongoose from "mongoose";
import dotenv from "dotenv";
import { Course } from "./models/course.model.js";
import { Lecture } from "./models/lecture.model.js";

dotenv.config();

const addDummyLectures = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const course = await Course.findOne({ courseTitle: "React for Beginners" });
        if (!course) {
            console.error("Course 'React for Beginners' not found!");
            return;
        }

        console.log(`Adding dummy lectures to ${course.courseTitle}...`);

        const lecture1 = await Lecture.create({
            lectureTitle: "Introduction to React",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            isPreviewFree: true
        });

        const lecture2 = await Lecture.create({
            lectureTitle: "React Hooks",
            videoUrl: "https://www.w3schools.com/html/movie.mp4",
            isPreviewFree: false
        });

        course.lectures.push(lecture1._id, lecture2._id);
        await course.save();

        console.log("SUCCESS: Dummy lectures added.");
    } catch (error) {
        console.error("Error adding lectures:", error);
    } finally {
        await mongoose.disconnect();
    }
}

addDummyLectures();
