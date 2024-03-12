import { Router } from 'express';
const router = Router();
import { BadRequestError } from '../util/expressError.js';
import { ensureLoggedIn, ensureAdmin } from '../middleware/auth.js';
import {
    addTeam,
    viewMyTeams,
    viewTeamById,
    editTeam,
    deleteTeam,
    addPokemonToTeam
} from '../service/teamService.js';

//teams //post a team for a user
router.post('/', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id
    try {
        const { response, errors, message, teams } = await addTeam(user_id, req.body);

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
        const { response, message, teams } = await viewMyTeams(user_id);

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
        const { response, message, team } = await viewTeamById(user_id, team_id);

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
        const { response, message, team } = await editTeam(user_id, team_id, req.body);

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
        const { response, message, team } = await deleteTeam(user_id, team_id);

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

//Add a pokemon to a team 
router.post('/addPokemon', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id

    try {
        const { response, errors, message, pokemon } = await addPokemonToTeam(user_id, req.body);
        if (response) {
            return res.status(201).json({
                message,
                pokemon
            })
        } else {
            res.status(400).json({
                message,
                errors
            })
        }
    } catch (err) {
        return next(err);
    }
});


export default router; 