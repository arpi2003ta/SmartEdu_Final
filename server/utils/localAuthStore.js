import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const dataDir = path.resolve(process.cwd(), ".local-data");
const usersFile = path.join(dataDir, "users.json");

const readUsers = async () => {
  try {
    const data = await fs.readFile(usersFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const writeUsers = async (users) => {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
};

export const sanitizeLocalUser = (user) => {
  if (!user) return null;
  const plainUser = user.toObject ? user.toObject() : user;
  const { password, __v, ...safeUser } = plainUser;

  return {
    ...safeUser,
    _id: safeUser._id?.toString ? safeUser._id.toString() : safeUser._id,
    enrolledCourses: safeUser.enrolledCourses || [],
    photoUrl: safeUser.photoUrl || "",
  };
};

export const findLocalUserByEmail = async (email) => {
  const users = await readUsers();
  const normalizedEmail = email.toLowerCase();
  return users.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
};

export const findLocalUserById = async (id) => {
  const users = await readUsers();
  return users.find((user) => user._id === id) || null;
};

export const createLocalUser = async ({ name, email, password, role }) => {
  const users = await readUsers();
  const now = new Date().toISOString();
  const user = {
    _id: crypto.randomUUID(),
    name,
    email,
    password,
    role,
    enrolledCourses: [],
    photoUrl: "",
    createdAt: now,
    updatedAt: now,
  };

  users.push(user);
  await writeUsers(users);
  return user;
};
