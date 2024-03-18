const express = require('express');
const router = express.Router();
const { BadRequestError } = require('../util/expressError')
const { ensureLoggedIn } = require('../middleware/auth');
const pokemonService = require('../service/myPokemonService');

//myPokemons //create a new pokemon for a user
router.post('/', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id
    try {
        const { response, errors, message, pokemon } = await pokemonService.createMyPokemon(user_id, req.body);

        if (response) {
            return res.status(201).json({
                response,
                message,
                pokemon
            })
        } else {
            return res.status(400).json({
                response,
                message,
            })
        }
    } catch (err) {
        return next(err);
    }
});

//myPokemons //view created pokemons from a user
router.get('/', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id
    try {
        const { response, message, pokemons } = await pokemonService.viewMyCreatedPokemons(user_id);

        if (response) {
            return res.status(200).json({
                response,
                message,
                pokemons
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

//myPokemons //edit created pokemons from a user
router.put('/:id', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id
    const pokemon_id = req.params.id;

    try {
        const { response, message, pokemon } = await pokemonService.editMyPokemon(user_id, pokemon_id, req.body);

        if (response) {
            return res.status(200).json({
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

//myPokemons delete pokemon by pokemon_id
router.delete('/:id', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id
    const pokemon_id = req.params.id;

    try {
        const { response, message, pokemon } = await pokemonService.deleteMyPokemon(user_id, pokemon_id);

        if (response) {
            return res.status(200).json({
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

router.post('/add/:id', ensureLoggedIn, async (req, res, next) => {
    const user_id = res.locals.user.id;
    const pokemon_id = req.params.id;

    try {
        const { response, errors, message, data } = await pokemonService.addPokemonToTeam(user_id, pokemon_id, req.body);
        if (response) {
            return res.status(201).json({
                response,
                message,
                pokemon: data
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