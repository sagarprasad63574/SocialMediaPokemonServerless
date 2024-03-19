const express = require('express');
const router = express.Router();
const { BadRequestError } = require('../util/expressError')

const { ensureLoggedIn, ensureAdmin } = require('../middleware/auth');
const pokemonService = require('../service/pokemonService');

//get a pokemon from the api
router.get('/:pokemon', ensureLoggedIn, async (req, res, next) => {
    const pokemon = req.params.pokemon;
    const user_id = res.locals.user.id;
    try {
        const { response, message } = await pokemonService.getPokemon(user_id, pokemon);

        if (response) {
            return res.status(200).json({
                response,
                message
            })
        } else {
            return res.status(200).json({
                response,
                message
            })
        }
    } catch (err) {
        return next(err);
    }
});

//Add a pokemon to a team 
router.post('/', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id;

    try {
        const { response, errors, message, pokemon } = await pokemonService.addPokemonToTeam(user_id, req.body);
        if (response) {
            return res.status(201).json({
                response,
                message,
                pokemon
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

//delete a pokemon from team
router.delete('/:teamid/:pokeid', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id;
    const team_id = req.params.teamid;
    const pokemon_id = req.params.pokeid;

    try {
        const { response, message, team } = await pokemonService.deletePokemonFromTeam(user_id, team_id, pokemon_id);

        if (response) {
            return res.status(200).json({
                response,
                message,
                team
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

//edit a pokemon from team
router.put('/:teamid/:pokeid', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id;
    const team_id = req.params.teamid;
    const pokemon_id = req.params.pokeid;

    try {
        const { response, message, team } = await pokemonService.editPokemonFromTeam(user_id, team_id, pokemon_id, req.body);

        if (response) {
            return res.status(200).json({
                response,
                message,
                team
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

router.post('/:teamid/:pokeid', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id;
    const team_id = req.params.teamid;
    const pokemon_id = req.params.pokeid;

    try {
        const { response, message, team } = await pokemonService.addMoveToPokemon(user_id, team_id, pokemon_id, req.body);

        if (response) {
            return res.status(200).json({
                response,
                message,
                team
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
