import React, { useState, useEffect } from "react";
import {
  FileOutlined,
  PlayCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Spin } from "antd";

const MessageContent = ({ message, user }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

  useEffect(() => {
    if (message.messageType && message.messageType !== "text") {
      setPreview(null);
      setLoading(false);
      setError(null);
      return;
    }

    const urlRegex = /(https?:\/\/[\S]+)/g;
    const urls = message.content?.match(urlRegex);

    setPreview(null);

    if (urls && urls.length > 0) {
      setLoading(true);
      setError(null);
      axios
        .get(
          `${API_BASE_URL}/chat/get-link-preview?url=${encodeURIComponent(
            urls[0]
          )}`,
          { withCredentials: true }
        )
        .then(({ data }) => {
          setPreview(data.data);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load link preview");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [message.content]);

  const getUsablePreview = (p) => {
    if (!p) return null;
    const title = (p.title || "").trim();
    const description = (p.description || "").trim();
    const url = (p.url || "").trim();
    const hasMedia =
      (Array.isArray(p.images) && p.images.length > 0) ||
      (Array.isArray(p.videos) && p.videos.length > 0);

    const looksLikeCloudflare =
      /just a moment/i.test(title) || /checking your browser/i.test(title);

    if (!url) return null;
    if (looksLikeCloudflare) return null;
    if (!title && !description && !hasMedia) return null;
    return p;
  };

  const usablePreview = getUsablePreview(preview);

  const senderId =
    typeof message.sender === "string" ? message.sender : message.sender._id;
  const isSender = senderId === user._id;

  switch (message.messageType) {
    case "image":
      return (
        <img
          src={message.fileUrl}
          alt={message.content}
          style={{ maxWidth: "100%", borderRadius: "8px" }}
        />
      );
    case "video":
      return (
        <video
          src={message.fileUrl}
          controls
          style={{ maxWidth: "100%", borderRadius: "8px" }}
        />
      );
    case "audio":
      return (
        <audio
          src={message.fileUrl}
          controls
          style={{
            filter: isSender ? "invert(1)" : "invert(0)",
          }}
        />
      );
    case "file":
      return (
        <a
          href={message.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "inherit",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FileOutlined style={{ marginRight: "8px" }} />
          {message.content}
        </a>
      );
    default:
      if (loading) {
        return (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        );
      }
      if (error) {
        return <div style={{ wordBreak: "break-word" }}>{message.content}</div>;
      }
      if (usablePreview) {
        return (
          <a
            href={usablePreview.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {Array.isArray(usablePreview.images) &&
              usablePreview.images.length > 0 && (
              <img
                src={usablePreview.images[0]}
                alt={usablePreview.title}
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            )}
            <div style={{ padding: "8px" }}>
              <div style={{ fontWeight: "bold" }}>{usablePreview.title}</div>
              <div>{usablePreview.description}</div>
            </div>
          </a>
        );
      }

      return <div style={{ wordBreak: "break-word" }}>{message.content}</div>;
  }
};

export default MessageContent;