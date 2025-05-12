// import jwt from "jsonwebtoken"
// import User from "../Model/userModel.js"

// const isLogin = (req, res, next) => {
//     try {
//         const token = req.cookies.jwt;

//         if (!token) return res.status(500).send({ success: false, message: "User Unauthorize" });

//         const decode = jwt.verify(token, prosess.env.JWT_SECRET);
//         if (!decode) return res.status(500).send({ success: false, message: "User Unauthorize - Invalid Token" });

//         const user = User.findById(decode.userId).select("-password");
//         if (!user) return res.status(500).send({ success: false, message: "User not found" });

//         req.user = user;
//         next();
//     } catch (error) {
//         console.log(`Error in isLogin = ${error.massage}`);
//         res.status(500).send({
//             success: false,
//             massage: error
//         })
//     }
// }

// export default isLogin;

import jwt from "jsonwebtoken";
import User from "../Model/userModel.js";

const isLogin = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).send({ success: false, message: "User Unauthorized - No Token" });
        }

        // FIX: Incorrect usage of jwt.verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // FIX: Wait for the user to be found (async call)
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(`Error in isLogin: ${error.message}`);
        res.status(500).send({
            success: false,
            message: "Authentication Failed",
            error: error.message
        });
    }
};

export default isLogin;
