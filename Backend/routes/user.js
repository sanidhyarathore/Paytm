const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const { JWT_SECRET } = require("../config")

const signupbody = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string(),

});

const signinbody = zod.object({
    password: zod.string(),
    username: zod.string().email()
});

router.post('/signup', async (req, res) => {

    const result = signupbody.safeParse(req.body);
    if (!result.success) {
        return res.status(411).json({
            message: "Incorrect Inputs"
        });
    }

    const existinguser = await User.findOne({ username: result.data.username })
    if (existinguser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        username: result.data.username,
        firstname: result.data.firstname,
        lastname: result.data.lastname,
        password: result.data.password
    })

    const userid = user._id;

    const token = jwt.sign({
        userid
    }, JWT_SECRET)
    res.status(200).json({
        message: "User successfully created",
        token: token
    });
});

router.post('/signin', async (req, res) => {
    const result = signinbody.safeParse(req.body);
    if (!result.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: result.data.username,
        password: result.data.password
    });

    if (!user) {
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const token = jwt.sign({
        userid: user._id
    }, JWT_SECRET);

    return res.status(200).json({
        token: token,
        message: "login successful"
    })
});

module.exports = router;