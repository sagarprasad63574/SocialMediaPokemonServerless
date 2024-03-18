const jsonschema = require('jsonschema');
const uuid = require('uuid');
const pokemonDAO = require('../repository/myPokemonDAO');
const createPokemonSchema = require('../schemas/createMyPokemonSchema.json');
const createdAddPokemonSchema = require('../schemas/createdAddPokemonSchema.json');
const {viewMyTeams, findTeamIndexToAddPokemon, viewTeamByName} = require('./teamService')
const logger = require('../util/logger');

const createMyPokemon = async (user_id, receivedData) => {

    let validPokemon = validatePokemon(receivedData);
    if (!validPokemon.response) return { response: false, message: validPokemon.errors }

    const duplicatePokemonName = await checkDuplicatedPokemonName(user_id, receivedData.pokemon_name);
    if (duplicatePokemonName.response) return { response: false, message: duplicatePokemonName.message }

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
            type: [
                {
                    type: {
                        name: "normal"
                    },
                    slot: 1
                }
            ],
            moves: []
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
    if (!response) return { response: false, message: errors }

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

const addPokemonToTeam = async (user_id, pokemon_id, receivedData) => {

    let validate = validateAddPokemon(receivedData);
    if (!validate.response) return { response: validate.response, message: validate.errors }

    const { response, message, teams } = await viewMyTeams(user_id);
    if (!response) return { response: false, message: "No team found!" }

    const pokemon = await viewMyPokemonsById(user_id, pokemon_id);
    if (!pokemon.response) return { response: false, message: pokemon.message};

    const findTeam = await viewTeamByName(user_id, receivedData.team_name);
    if (!findTeam.response) return { response: false, message: findTeam.message}
    
    const team_index = findTeamIndexToAddPokemon(receivedData.team_name, teams);
    if (team_index < 0) return { response: false, message: "No team found with given name!" }

    if (teams[team_index].pokemons.length >= 6)
        return { response: false, message: "A team can only have 6 pokemon!" }

    const poke = {
        pokemon_id: pokemon.pokemon.pokemon_id, 
        pokemon_name: pokemon.pokemon.pokemon_name,
        attack: pokemon.pokemon.attack, 
        defense: pokemon.pokemon.defense, 
        specialattack: pokemon.pokemon.specialattack,
        specialdefense: pokemon.pokemon.specialdefense, 
        speed: pokemon.pokemon.speed, 
        hp: pokemon.pokemon.hp, 
        type: pokemon.pokemon.type,
        moves:[]
    };

    let data = await pokemonDAO.addPokemonToTeam(user_id, team_index, poke);

    console.log(findTeam)
    if (data) { return { response: true, message: `New pokemon added to team: ${findTeam.team[0].team_name}`, data } }

    return { response: false, message: "Cannot add to team" };
}

function validateAddPokemon(receivedData) {
    const validator = jsonschema.validate(receivedData, createdAddPokemonSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        logger.error(errs);
        return { reponse: false, errors: errs }
    }
    return { response: true }
}

module.exports = {
    createMyPokemon,
    viewMyCreatedPokemons,
    editMyPokemon,
    deleteMyPokemon,
    addPokemonToTeam
}