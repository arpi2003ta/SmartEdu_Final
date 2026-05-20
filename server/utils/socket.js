export const emitSocketEvent = (req, userId, event, data) => {
  const io = req.app.get("io");
  const userSocketMap = req.app.get("userSocketMap");
  const sockets = userSocketMap.get(userId);

  if (!sockets) return;

  // Handle both legacy string mapping and new Set-based mapping
  if (sockets instanceof Set) {
    sockets.forEach((socketId) => {
      io.to(socketId).emit(event, data);
    });
  } else {
    io.to(sockets).emit(event, data);
  }
};