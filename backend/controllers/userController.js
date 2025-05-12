import User from "../Model/userModel.js";
import bcryptjs from "bcryptjs"
import jwtToken from "../utills/jwtToken.js";

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;

        const user = await User.findOne({ username, email });

        if (user) return res.status(500).send({ success: false, massage: "User or email Already exist" });

        const hashpassword = bcryptjs.hashSync(password, 10);

        const profilePic = profilepic;

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashpassword,
            gender,
            profilePic
        })

        if (newUser) {
            await newUser.save();
            jwtToken(newUser._id, res);
        } else {
            res.status(500).send({ success: false, massage: "Invalid User Data" })
        }

        res.status(201).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic,
            email: newUser.email
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            massage: error
        })
        console.log(error);
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(500).send({ success: false, message: "Email Doesn't Exist" });
        const comparePass = bcryptjs.compareSync(password, user.password || "");
        if (!comparePass) return res.status(500).send({ success: false, message: "Email or Password doesn't Matching" });

        jwtToken(user._id, res);

        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            message: "Succesfully Login"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            massage: error
        })
        console.log(error);
    }
}

export const userLogout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })

        res.status(200).send({ massage: "User Logout succesfully" })
    } catch (error) {
        res.status(500).send({
            success: false,
            massage: error
        })
        console.log(error);

    }
}