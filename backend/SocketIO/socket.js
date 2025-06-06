import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // your frontend origin
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// In-memory map to store online users
const userSocketMap = {}; // userId -> socket.id

// Utility to get socket ID of a user
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

// Socket.IO connection
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    console.log(`✅ User connected: ${userId}, Socket ID: ${socket.id}`);

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // broadcast updated list
    }

    // Listen for messages
    socket.on("sendMessage", ({ receiverId, newMessage }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
    });

    // Disconnect cleanup
    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${userId}`);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Start the server
const PORT = process.env.PORT || 8001;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { app, io, server };
