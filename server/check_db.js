import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const checkDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI not found");
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);

        const courses = await mongoose.connection.db.collection("courses").find({}).toArray();
        console.log("=== Courses ===");
        console.table(courses.map(c => ({
            id: c._id,
            title: c.courseTitle,
            isPublished: c.isPublished
        })));

        const purchases = await mongoose.connection.db.collection("coursepurchases").find({}).toArray();
        console.log("=== Purchases ===");
        console.table(purchases.map(p => ({
            id: p._id,
            courseId: p.courseId,
            userId: p.userId,
            status: p.status
        })));

        const users = await mongoose.connection.db.collection("users").find({}).toArray();
        console.log("=== Users ===");
        console.table(users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role
        })));

    } catch (error) {
        console.error("Error checking DB:", error);
    } finally {
        await mongoose.disconnect();
    }
}

checkDB();
