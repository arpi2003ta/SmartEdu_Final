import express from "express";
import multer from "multer";
import  isAuthenticated  from "../middlewares/isAuthenticated.js";
import {
  sendMessage,
  getChats,
  getMessages,
  markAsRead,
  sendFileMessage,
  getLinkPreview,
  deleteChat,
  deleteMessage,
} from "../controllers/chat.controller.js";

const router = express.Router();
const chatFileUpload = multer({ storage: multer.memoryStorage() }).single("file");

router.post("/send", isAuthenticated, sendMessage);
router.post("/send-file", isAuthenticated, chatFileUpload, sendFileMessage);
router.get("/chats", isAuthenticated, getChats);
router.get("/messages/:chatId", isAuthenticated, getMessages);
router.post("/mark-read", isAuthenticated, markAsRead);
router.get("/get-link-preview", isAuthenticated, getLinkPreview);
router.delete("/chat/:chatId", isAuthenticated, deleteChat);
router.delete("/message/:messageId", isAuthenticated, deleteMessage);

export default router;
