import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
    },
});

const userSocketmap = {}; // userId -> socket.id

export const getReceiverSocketId = (receiverId) => {
    return userSocketmap[receiverId];
};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
        userSocketmap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketmap));

    socket.on("disconnect", () => {
        delete userSocketmap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketmap));
    });

    // Example: listening for sendMessage from client
    socket.on("sendMessage", ({ receiverId, newMessage }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
    });
});

export { app, io, server };
