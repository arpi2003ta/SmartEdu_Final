import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const testDb = async () => {
    try {
        console.log("Connecting to", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const email = "test@example.com";
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: "Test User",
                email,
                password: hashedPassword,
                role: "student"
            });
            console.log("Created test user:", user.email);
        } else {
            console.log("Test user already exists");
        }

    } catch (error) {
        console.error("DB Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

testDb();
