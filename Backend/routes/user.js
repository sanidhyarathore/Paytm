const express = require("express");
const zod = require("zod");
const { jwt } = require("jsonwebtoken");
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
    const data = req.body;
    const { result } = signupbody.safeParse(data);
    if (!result) {
        return res.status(411).json({
            message: "Incorrect Inputs"
        });
    }

    const existinguser = await User.findOne(result.email)
    if (existinguser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        username: result.username,
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        password: result.password
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