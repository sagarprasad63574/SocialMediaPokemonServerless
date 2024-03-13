const jsonschema = require('jsonschema');
const uuid = require('uuid');
const pokemonDAO = require('../repository/myPokemonDAO');
const createPokemonSchema = require('../schemas/createMyPokemonSchema.json');
const editPokemonSchema = require('../schemas/editMyPokemonSchema.json')
const logger = require('../util/logger');

const createMyPokemon = async (user_id, receivedData) => {

    let validPokemon = validatePokemon(receivedData);
    if (!validPokemon.response) return { response: false, errors: validPokemon.errors }

    const duplicatePokemonName = await checkDuplicatedPokemonName(user_id, receivedData.pokemon_name);
    if (duplicatePokemonName.response) return { response: false, errors: duplicatePokemonName.message }

    const pokemon_id = uuid.v4();

    let data = await pokemonDAO.createMyPokemon(
        user_id,
        {
            pokemon_id,
            pokemon_name: receivedData.pokemon_name,
            attack: receivedData.attack,
            defense: receivedData.defense,
            specialattack: receivedData.specialattack,
            specialdefense: receivedData.specialdefense,
            speed: receivedData.speed,
            hp: receivedData.hp,
            types: []
        });


    if (data) {
        let index = data.length - 1;
        let pokemon = data[index];
        if (index >= 0) pokemon.index = index;

        return { response: true, message: "New pokemon created", pokemon };
    }

    return { response: false };

}

function validatePokemon(receivedData) {
    const validator = jsonschema.validate(receivedData, createPokemonSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        logger.error(errs);
        return { response: false, errors: errs }
    }
    return { response: true }
}

async function checkDuplicatedPokemonName(user_id, pokemon_name) {
    const { response, message, pokemons } = await viewMyCreatedPokemons(user_id);
    if (!response) return { response: false, message: "No pokemons found!" };

    const findPokemon = pokemons.find(pokemon => pokemon.pokemon_name === pokemon_name);
    if (!findPokemon) return { response: false }
    return { response: true, message: "Duplicate pokemon name" }
}

const viewMyCreatedPokemons = async (user_id) => {

    let pokemons = await pokemonDAO.ViewMyPokemons(user_id);
    if (pokemons.length == 0) {
        return { response: false, message: "No pokemons found!" };
    }
    return { response: true, message: "My pokemons", pokemons };
}

const editMyPokemon = async (user_id, pokemon_index, receivedData) => {

    let { response, errors } = validateEditMyPokemon(receivedData);
    if (!response) return { response: false, errors: errors }

    const getMyPokemon = await viewMyPokemonsById(user_id, pokemon_index);
    if (!getMyPokemon.response) return { response: getMyPokemon.response, message: getMyPokemon.message };

    const duplicatePokemonName = await checkDuplicatedPokemonName(user_id, receivedData.pokemon_name);
    if (duplicatePokemonName.response) return { response: false, message: duplicatePokemonName.message };

    let pokemon = await pokemonDAO.editMyPokemon(
        user_id,
        pokemon_index,
        {
            pokemon_id: getMyPokemon.pokemon.pokemon_id,
            pokemon_name: receivedData.pokemon_name,
            attack: receivedData.attack,
            defense: receivedData.defense,
            specialattack: receivedData.specialattack,
            specialdefense: receivedData.specialdefense,
            speed: receivedData.speed,
            hp: receivedData.hp,
            types: getMyPokemon.pokemon.types
        });

    if (pokemon) {
        return { response: true, message: "Pokemon edited!", pokemon };
    }

    return { response: false };

}

function validateEditMyPokemon(receivedData) {
    const validator = jsonschema.validate(receivedData, createPokemonSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        logger.error(errs);
        return { response: false, errors: errs }
    }
    return { response: true }
}

const viewMyPokemonsById = async (user_id, pokemon_index) => {

    const { response, message, pokemons } = await viewMyCreatedPokemons(user_id);
    if (!response) return { response, message }

    const pokemon = pokemons[pokemon_index];

    if (response && pokemon) {
        return { response, pokemon }
    }
    return { response: false, message: `No pokemon found with id ${pokemon_index}` }
}

const deleteMyPokemon = async (user_id, pokemon_index) => {
    const getMyPokemon = await viewMyPokemonsById(user_id, pokemon_index);
    if (!getMyPokemon.response) return { response: getMyPokemon.response, message: getMyPokemon.message };

    let data = await pokemonDAO.deleteMyPokemon(
        user_id,
        pokemon_index
    );

    if (data) {
        return {
            response: true,
            message: `Deleted pokemon with pokemon id: ${pokemon_index}, pokemon name: ${getMyPokemon.pokemon.pokemon_name}`
        };
    }
    return { response: false };

}

module.exports = {
    createMyPokemon,
    viewMyCreatedPokemons,
    editMyPokemon,
    deleteMyPokemon
}