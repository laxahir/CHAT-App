import mongoose from "mongoose";

const ConversationSchema = mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ]
}, { timestamps: true }); // ✅ fixed here

const Conversation = mongoose.model('Conversation', ConversationSchema);

export default Conversation;
