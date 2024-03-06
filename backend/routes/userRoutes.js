const express = require('express');
const userService = require('../service/userService');

const router = express.Router();

// app.post('/register', async (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const email = req.body.email;
//     if (!username || !password || !email) return res.status(400).json({ message: "You must provide a username, password, and email" });
//     const data = await userService.registerUser(username, password, email);
//     if (data) return res.status(201).json({ message: `User ${username} created`, data });
//     else return res.status(400).json({ message: `User ${username} already exists` });
// });

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