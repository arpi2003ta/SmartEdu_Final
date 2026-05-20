import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models using absolute paths to avoid resolution issues
import { User } from "./models/user.model.js";

dotenv.config();

const listUsers = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI not found in .env");
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, "name email role");
        console.log("=== Users in Database ===");
        users.forEach(u => {
            console.log(`Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
        });
    } catch (error) {
        console.error("Error listing users:", error);
    } finally {
        await mongoose.disconnect();
    }
}

listUsers();
