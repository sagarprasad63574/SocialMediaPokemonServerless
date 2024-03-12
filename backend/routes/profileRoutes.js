const express = require('express');
const userService = require('../service/userService');
const { ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError, NotFoundError } = require('../util/expressError');

const router = express.Router();

router.post('/', ensureLoggedIn, async (req, res, next) => {
    const username = res.locals.username;
    try {
        const data = await userService.editProfile({username, ...req.body});
        if(!data.response) throw new BadRequestError(data.errors);
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
});

router.get('/', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.id;
    try {
        const data = await userService.getUser(user_id);
        if(!data.response) throw new NotFoundError(data.errors);
        return res.status(200).json(data);     
    } catch (error) {
        return next(error);
    }
});

module.exports = router;