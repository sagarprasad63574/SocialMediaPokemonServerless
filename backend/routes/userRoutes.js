const express = require('express');
const userService = require('../service/userService');
const { BadRequestError } = require('../util/expressError');
const { authenticateJWT, ensureLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
    const data = await userService.registerUser(req.body);
    if(!data.response) throw new BadRequestError(data.errors);
    return res.status(201).json(data);
});

router.post('/login', async (req, res) => {
    const data = await userService.loginUser(req.body);
    if(!data.response) throw new BadRequestError(data.errors);
    return res.status(200).json(data);
});

router.post('/bio', authenticateJWT, async (req, res) => {
    const username = req.user.username;
    const biography = req.body.biography;
    const data = await userService.addBio({username, biography});
    if(!data.response) throw new BadRequestError(data.errors);
    return res.status(200).json(data);
});

module.exports = router;