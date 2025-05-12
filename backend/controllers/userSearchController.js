import Conversation from "../Model/ConversationModel.js";
import User from "../Model/userModel.js";

export const getUserBySearch = async (req, res) => {
    try {

        const search = req.query.search || "";
        const currentUserId = req.user._id;
        // const users = await User.find({
        //     _id: { $ne: currentUserId },
        //     $or: [
        //         { username: { $regex: search, $options: "i" } },
        //         { fullname: { $regex: search, $options: "i" } }
        //     ]
        // }).select("-password");

        // res.status(200).send(users);

        const users = await User.find({
            _id: { $ne: currentUserId },
            $or: [
                { username: new RegExp(search, "i") },
                { fullname: new RegExp(search, "i") }
            ]
        }).select("-password");
        res.status(200).send(users);

    } catch (error) {
        res.status(500).send({
            success: false,
            massage: error
        })
        console.log(`search : ${error}`);
    }
}


// export const getUserBySearch = async (req, res) => {
//     try {
//         const search = req.query.search?.trim() || "";

//         if (!search) {
//             return res.status(200).send([]);
//         }

//         // Search for users where either the username or fullname contains the search string (case-insensitive)
//         const users = await User.find({
//             $or: [
//                 { username: { $regex: search, $options: "i" } },
//                 { fullname: { $regex: search, $options: "i" } }
//             ]
//         }).select("-password"); // Exclude password from response

//         res.status(200).send(users);

//     } catch (error) {
//         console.error("Search error:", error);
//         res.status(500).send({
//             success: false,
//             message: error.message || "Something went wrong"
//         });
//     }
// };





export const getcurrentchatter = async (req, res) => {
    try {

        const currentUserId = req.user._id;
        const currentchatters = await Conversation.find({
            participants: currentUserId
        }).sort({
            updatedAt: -1
        });

        if (!currentchatters || currentchatters.length === 0) return res.status(200).send([]);

        const participantId = currentchatters.reduce((ids, conversation) => {
            const otherparticipants = conversation.participants.filter(
                id => id.toString() !== currentUserId.toString()
            );
            return [...ids, ...otherparticipants];
        }, []);


        const otherparticipantsID = participantId.filter(id => id.toString() !== currentUserId.toString());

        const user = await User.find({ _id: { $in: otherparticipantsID } }).select("-password -email");

        const users = otherparticipantsID.map(id => user.find(user => user._id.toString() === id.toString()));


        res.status(200).send(users);

    } catch (error) {
        res.status(500).send({
            success: false,
            massage: error
        })
        console.log(`search : ${error}`);
    }
}