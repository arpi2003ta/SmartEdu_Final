const conversationsByUser = new Map();

const routeHints = [
  { pattern: /\b(home|main|start)\b/i, path: "/", label: "home" },
  { pattern: /\b(course|courses|search|browse)\b/i, path: "/course/search", label: "courses" },
  { pattern: /\b(my learning|learning|enrolled)\b/i, path: "/my-learning", label: "my learning" },
  { pattern: /\b(profile|account)\b/i, path: "/profile", label: "profile" },
  { pattern: /\b(ai examiner|examiner)\b/i, path: "/ai-examiner", label: "AI examiner" },
  { pattern: /\b(roadmap|planner|schedule)\b/i, path: "/ai-roadmap", label: "AI roadmap" },
  { pattern: /\b(college|predictor)\b/i, path: "/college-predictor", label: "college predictor" },
];

const buildAssistantResponse = (query = "") => {
  const cleanQuery = query.trim();
  const hint = routeHints.find(({ pattern }) => pattern.test(cleanQuery));

  if (hint) {
    return {
      message: `Opening ${hint.label}.`,
      action: "navigate",
      path: hint.path,
    };
  }

  return {
    message:
      cleanQuery.length > 0
        ? "I can help you navigate to courses, learning, profile, AI examiner, roadmap, and college predictor."
        : "Please send a question or navigation command.",
    action: "reply",
  };
};

const saveConversation = ({ userId = "anonymous", query, queryType, response }) => {
  const conversation = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    query,
    queryType,
    response,
    createdAt: new Date().toISOString(),
  };
  const history = conversationsByUser.get(userId) || [];
  history.unshift(conversation);
  conversationsByUser.set(userId, history.slice(0, 25));
  return conversation;
};

export const processVoiceAssistantQuery = (req, res) => {
  const { query = "", queryType = "text", userId } = req.body || {};

  if (typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Query is required.",
    });
  }

  const response = buildAssistantResponse(query);
  const conversation = saveConversation({ userId, query, queryType, response });

  return res.status(200).json({
    success: true,
    data: {
      response,
      conversation,
    },
  });
};

export const processPublicVoiceAssistantQuery = (req, res) => {
  const { query = "", queryType = "text" } = req.body || {};

  if (typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Query is required.",
    });
  }

  const response = buildAssistantResponse(query);
  const conversation = saveConversation({ query, queryType, response });

  return res.status(200).json({
    success: true,
    data: {
      response,
      conversation,
    },
  });
};

export const getVoiceAssistantHistory = (req, res) => {
  const { userId } = req.params;
  const conversations = conversationsByUser.get(userId) || [];

  return res.status(200).json({
    success: true,
    data: {
      conversations,
    },
  });
};
