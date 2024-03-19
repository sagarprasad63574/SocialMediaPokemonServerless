const express = require('express');
const router = express.Router();
const battleSimService = require('../service/battleSim');
const { ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError, NotFoundError } = require('../util/expressError');


router.post('/', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id;

    try {
        const { response, errors, message, details, summary } = await battleSimService.battleSim(user_id, req.body);
        if (response) {
            return res.status(201).json({
                response,
                message,
                summary,
                details
            })
        } else {
            return res.status(400).json({
                response,
                message
            })
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router; 