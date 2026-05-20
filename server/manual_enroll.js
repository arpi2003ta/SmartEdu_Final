import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";
import { Course } from "./models/course.model.js";
import { CoursePurchase } from "./models/coursePurchase.model.js";

dotenv.config();

const enrollUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const user = await User.findOne({ email: "student@gmail.com" });
        const course = await Course.findOne({ courseTitle: "React for Beginners" });

        if (!user || !course) {
            console.error("User or Course not found!");
            return;
        }

        console.log(`Enrolling ${user.name} in ${course.courseTitle}...`);

        // Create or Update Purchase
        await CoursePurchase.findOneAndUpdate(
            { userId: user._id, courseId: course._id },
            {
                status: "completed",
                amount: course.coursePrice,
                paymentId: "manual_enrollment_" + Date.now()
            },
            { upsert: true, new: true }
        );

        // Update User enrolledCourses
        await User.findByIdAndUpdate(user._id, {
            $addToSet: { enrolledCourses: course._id }
        });

        // Update Course enrolledStudents
        await Course.findByIdAndUpdate(course._id, {
            $addToSet: { enrolledStudents: user._id }
        });

        console.log("SUCCESS: User enrolled. You can now access the chat!");
    } catch (error) {
        console.error("Error during enrollment:", error);
    } finally {
        await mongoose.disconnect();
    }
}

enrollUser();
