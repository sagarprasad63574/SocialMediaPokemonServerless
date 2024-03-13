const express = require('express');
const router = express.Router();
const { BadRequestError } = require('../util/expressError')

const { ensureLoggedIn, ensureAdmin } = require('../middleware/auth');
const teamService = require('../service/teamService');

//teams //post a team for a user
router.post('/', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id
    try {
        const { response, errors, message, teams } = await teamService.addTeam(user_id, req.body);

        if (response) {
            return res.status(201).json({
                message,
                teams
            })
        } else {
            throw new BadRequestError(errors);
        }
    } catch (err) {
        return next(err);
    }
});

//teams get all teams for a user
router.get('/', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id
    try {
        const { response, message, teams } = await teamService.viewMyTeams(user_id);

        if (response) {
            return res.status(200).json({
                message,
                teams
            })
        } else {
            return res.status(200).json({
                message
            })
        }
    } catch (err) {
        return next(err);
    }
});

//view a team by team_id
router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    const team_id = req.params.id;
    const user_id = res.locals.user.id
    try {
        const { response, message, team } = await teamService.viewTeamById(user_id, team_id);

        if (response) {
            return res.status(200).json({
                message,
                team
            })
        } else {
            return res.status(200).json({
                message
            })
        }
    } catch (err) {
        return next(err);
    }
});

//edit a team name by team_id
router.put('/:id', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id
    const team_id = req.params.id;

    try {
        const { response, message, team } = await teamService.editTeam(user_id, team_id, req.body);

        if (response) {
            return res.status(200).json({
                message,
                team
            })
        } else {
            return res.status(400).json({
                message
            })
        }
    } catch (err) {
        return next(err);
    }
});

//delete a team name by team_id
router.delete('/:id', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id
    const team_id = req.params.id;

    try {
        const { response, message, team } = await teamService.deleteTeam(user_id, team_id);

        if (response) {
            return res.status(200).json({
                message,
                team
            })
        } else {
            return res.status(400).json({
                message
            })
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router; 