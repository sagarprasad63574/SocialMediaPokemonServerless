const express = require('express');
const { ensureLoggedIn } = require('../middleware/auth');
const { UnauthorizedError } = require('../util/expressError');

const router = express.Router();

router.get('/', ensureLoggedIn, async (req, res, next) => {
    const user = res.locals.user
    if (user) {
        return res.status(200).json(user);
    }
    throw new UnauthorizedError;
});

module.exports = router;