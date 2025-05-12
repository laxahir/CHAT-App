import express from "express"
import path, { format } from "path"
import dotenv from "dotenv"
import cors from "cors";
import dbConnect from "./DB/dbconfig.js";
import authRoute from "./routes/authUser.js"
import messageRouter from "./routes/messageRout.js"
import userRouter from "./routes/userRoute.js"
import cookieParser from "cookie-parser";

import { app, server } from "./SocketIO/socket.js"

const __dirname = path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

<<<<<<< HEAD
app.use(cors({
    origin: "http://localhost:5173", // frontend dev server
    credentials: true                // allow cookies
}));
=======
// app.use(cors({
//     origin: "http://localhost:5173", // frontend dev server
//     credentials: true                // allow cookies
// }));
>>>>>>> 29d479e691e6ef6d392cfd54755818dc38f6542c

app.use("/api/auth", authRoute);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

app.use(express.static(path.join(__dirname, "/frontend/dist")))

<<<<<<< HEAD
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
// })
=======
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
})
>>>>>>> 29d479e691e6ef6d392cfd54755818dc38f6542c

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    dbConnect();
    console.log(`server running on ${PORT}`);
})