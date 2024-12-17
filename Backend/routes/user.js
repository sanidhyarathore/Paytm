const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const { JWT_SECRET } = require("../config")

const signupbody = zod.object({
    username: zod.string(),
    firstname: zod.string(),
    lastname: zod.string(),
    email: zod.string().email(),
    password: zod.string(),

})

router.post('/signup', async (req, res) => {

    const result = signupbody.safeParse(req.body);
    if (!result.success) {
        return res.status(411).json({
            message: "Incorrect Inputs"
        });
    }

    const existinguser = await User.findOne({ email: result.data.email })
    if (existinguser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        username: result.data.username,
        firstname: result.data.firstname,
        lastname: result.data.lastname,
        email: result.data.email,
        password: result.data.password
    })

    const userid = user._id;

    const token = jwt.sign({
        userid
    }, JWT_SECRET)
    res.json({
        message: "User successfully created",
        token: token
    });
});



module.exports = router;