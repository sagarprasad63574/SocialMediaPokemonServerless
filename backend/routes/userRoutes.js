const express = require('express');
const userService = require('../service/userService');
const { BadRequestError } = require('../util/expressError');
const {createToken} = require('../util/tokens');

const router = express.Router();

router.post('/register', async (req, res) => {
    const data = await userService.registerUser(req.body);
    if(!data.response) throw new BadRequestError(data.errors);
    return res.status(201).json(data);
});

router.post('/login', async (req, res) => {
    const data = await userService.loginUser(req.body);
    const token = createToken(data);
});

// app.post('/login', async (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     //throw new BadRequestError(errs)
//     if (!username || !password) return res.status(400).json({ message: "You must provide a username and password" });
//     const token = await userService.loginUser(username, password);
//     if (!token) return res.status(400).json({ message: "Username and/or password incorrect" });
//     return res.status(200).json({ message: "User logged in successfully", token });
// });

// const validator = jsonschema.validate(req.body, userRegisterSchema);
// if (!validator.valid) {
//     const errs = validator.errors.map(e => e.stack);
//     throw new BadRequestError(errs);
// }



module.exports = router;