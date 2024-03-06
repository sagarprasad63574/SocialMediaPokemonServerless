const express = require('express');
const router = express.Router();

const { ensureLoggedIn, ensureAdmin } = require('../middleware/auth');
const teamService = require('../service/teamService');

router.post('/', async (req, res, next) => {
    const team_name = "team1";

    try {
        const { response } = await teamService.addTeam(team_name);

        if (response) {
            return res.status(201).json({
                message: "New team created"
            })
        } else {
            return res.status(400).json({ message: "Team NOT created" })
        }
    } catch (err) {
        return next(err);
    }
});


module.exports = router; 