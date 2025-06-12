// socket.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const userSocketMap = {};

// Utility to get socket ID for a user
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

// Socket.io connection
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`✅ User connected: ${userId}, Socket ID: ${socket.id}`);

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("sendMessage", ({ receiverId, newMessage }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
    });

    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${userId}`);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Only listen once (in main file)
export { app, io, server };
