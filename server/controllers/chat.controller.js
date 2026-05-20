import { uploadMedia } from "../utils/cloudinary.js";
import { Chat, Message } from "../models/chat.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { emitSocketEvent } from "../utils/socket.js";
import {User} from "../models/user.model.js";
import { getLinkPreview as getLinkPreviewFromPackage } from "link-preview-js";

export const sendMessage = async (req, res, next) => {
  try {
    const { courseId, receiverId, content } = req.body;
    //const senderId = req.id;
    const senderId = req.user._id;
    const senderRole = req.user.role;

    // FETCH user from DB
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check course purchase
   const purchase = await CoursePurchase.findOne({
     userId: senderId,
     courseId: courseId,
     status: "completed",
   });


   if (!purchase && senderRole !== "instructor") {
     return res.status(403).json({
       success: false,
       message: "Purchase the course to chat with instructor",
     });
   }

    // Create and save message
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      course: courseId,
      content,
    });
    await newMessage.save();

    // Find or create chat
    let chat = await Chat.findOne({
      course: courseId,
      $or: [
        { student: senderId, instructor: receiverId },
        { student: receiverId, instructor: senderId },
      ],
    });

    if (!chat) {
      chat = new Chat({
        student: sender.role === "student" ? senderId : receiverId,
        instructor: sender.role === "instructor" ? senderId : receiverId,
        course: courseId,
        messages: [newMessage._id],
        lastMessage: newMessage._id,
      });
    } else {
      chat.messages.push(newMessage._id);
      chat.lastMessage = newMessage._id;
      chat.updatedAt = Date.now();
    }
    await chat.save();

    const messagePayload = {
      ...newMessage.toObject(),
      chat: chat._id,
    };

    // Emit socket event
    emitSocketEvent(req, receiverId.toString(), "newMessage", messagePayload);
    emitSocketEvent(req, senderId.toString(), "newMessage", messagePayload);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getChats = async (req, res) => {
  try {
    //const user = await User.findById(req.id);
    const user = req.user;    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userId = user._id;
    const role = user.role;

    let chats;
    if (role === "student") {
      chats = await Chat.find({ student: userId })
        .populate("instructor", "name avatar")
        .populate("course", "title courseTitle")
        .populate({
          path: "lastMessage",
          populate: { path: "receiver", select: "_id" },
        })
        .sort({ updatedAt: -1 });
    } else if (role === "instructor") {
      chats = await Chat.find({ instructor: userId })
        .populate("student", "name avatar")
        .populate("course", "title courseTitle")
        .populate({
          path: "lastMessage",
          populate: { path: "receiver", select: "_id" },
        })
        .sort({ updatedAt: -1 });
    }

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
      error: error.message,
    });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId).populate({
      path: "messages",
      populate: [
        { path: "sender", select: "name avatar" },
        { path: "receiver", select: "name avatar" },
      ],
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Check if user is part of this chat
    if (
      ![chat.student.toString(), chat.instructor.toString()].includes(
        userId.toString()
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this chat",
      });
    }

    res.status(200).json({
      success: true,
      data: chat.messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;

    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { read: true } }
    );

    const messages = await Message.find({ _id: { $in: messageIds } });

    const senderMessagesMap = messages.reduce((acc, msg) => {
      const senderId = msg.sender.toString();
      if (!acc[senderId]) {
        acc[senderId] = [];
      }
      acc[senderId].push(msg._id.toString());
      return acc;
    }, {});

    Object.entries(senderMessagesMap).forEach(([senderId, ids]) => {
      emitSocketEvent(req, senderId, "messagesRead", { messageIds: ids });
    });

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark messages as read",
      error: error.message,
    });
  }
};

export const sendFileMessage = async (req, res, next) => {
  try {
    const { courseId, receiverId } = req.body;
    const senderId = req.user._id;
    const senderRole = req.user.role;

    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const purchase = await CoursePurchase.findOne({
      userId: senderId,
      courseId: courseId,
      status: "completed",
    });

    if (!purchase && senderRole !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Purchase the course to chat with the instructor",
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const myCloud = await uploadMedia(file);

    let messageType;
    if (file.mimetype.startsWith("image")) {
      messageType = "image";
    } else if (file.mimetype.startsWith("video")) {
      messageType = "video";
    } else if (file.mimetype.startsWith("audio")) {
      messageType = "audio";
    } else {
      messageType = "file";
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      course: courseId,
      messageType,
      fileUrl: myCloud.secure_url,
      content: file.originalname,
    });
    await newMessage.save();

    let chat = await Chat.findOne({
      course: courseId,
      $or: [
        { student: senderId, instructor: receiverId },
        { student: receiverId, instructor: senderId },
      ],
    });

    if (!chat) {
      chat = new Chat({
        student: sender.role === "student" ? senderId : receiverId,
        instructor: sender.role === "instructor" ? senderId : receiverId,
        course: courseId,
        messages: [newMessage._id],
        lastMessage: newMessage._id,
      });
    } else {
      chat.messages.push(newMessage._id);
      chat.lastMessage = newMessage._id;
      chat.updatedAt = Date.now();
    }
    await chat.save();

    const messagePayload = {
      ...newMessage.toObject(),
      chat: chat._id,
    };

    emitSocketEvent(req, receiverId.toString(), "newMessage", messagePayload);
    emitSocketEvent(req, senderId.toString(), "newMessage", messagePayload);

    res.status(201).json({
      success: true,
      message: "File sent successfully",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id.toString();

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      });
    }

    const chat = await Chat.findOne({ messages: messageId });

    if (chat) {
      chat.messages.pull(messageId);

      if (
        chat.lastMessage &&
        chat.lastMessage.toString() === messageId.toString()
      ) {
        if (chat.messages.length > 0) {
          chat.lastMessage = chat.messages[chat.messages.length - 1];
        } else {
          chat.lastMessage = undefined;
        }
      }

      chat.updatedAt = Date.now();
      await chat.save();
    }

    await Message.findByIdAndDelete(messageId);

    const payload = {
      messageId,
      chatId: chat?._id,
    };

    emitSocketEvent(req, message.sender.toString(), "messageDeleted", payload);
    emitSocketEvent(req, message.receiver.toString(), "messageDeleted", payload);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id.toString();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (
      ![chat.student.toString(), chat.instructor.toString()].includes(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this chat",
      });
    }

    const messageIds = chat.messages;

    if (messageIds && messageIds.length > 0) {
      await Message.deleteMany({ _id: { $in: messageIds } });
    }

    await Chat.findByIdAndDelete(chatId);

    const payload = { chatId };
    emitSocketEvent(req, chat.student.toString(), "chatDeleted", payload);
    emitSocketEvent(req, chat.instructor.toString(), "chatDeleted", payload);

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete chat",
      error: error.message,
    });
  }
};

export const getLinkPreview = async (req, res, next) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ success: false, message: "URL is required" });
    }
 
    const rawUrl = String(url).trim();
    if (!rawUrl) {
      return res.status(400).json({ success: false, message: "URL is required" });
    }
 
    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid URL" });
    }
 
    const protocol = parsed.protocol.toLowerCase();
    if (protocol !== "http:" && protocol !== "https:") {
      return res
        .status(400)
        .json({ success: false, message: "Only http/https URLs are supported" });
    }
 
    const preview = await getLinkPreviewFromPackage(parsed.toString(), {
      followRedirects: "follow",
      timeout: 8000,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
    });
 
    res.status(200).json({ success: true, data: preview });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: {
        url: req.query?.url,
        title: "",
        description: "",
        mediaType: "",
        contentType: "",
        images: [],
        videos: [],
      },
    });
  }
 };