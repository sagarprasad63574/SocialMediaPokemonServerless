const jsonschema = require('jsonschema');
const uuid = require('uuid');
const teamDAO = require('../repository/teamDAO');
const pokemonDAO = require('../repository/pokemonDAO');
const teamAddSchema = require('../schemas/teamAddSchema.json');
const teamEditSchema = require('../schemas/teamEditSchema.json');
const pokemonAddSchema = require('../schemas/pokemonAddSchema.json');
const logger = require('../util/logger');

const viewMyTeams = async (user_id) => {

    let teams = await teamDAO.ViewUsersTeams(user_id);
    if (teams.length == 0) {
        return { response: false, message: "No teams found!" };
    }
    return { response: true, message: "My teams", teams };
}

const getPokemon = async (user_id, pokemon_name) => {
    const data = await pokemonDAO.pokedata(pokemon_name);

    if (data) {
        return { response: true, message: data.data }
    }
    else
    {
        return { response: false, message: "pokemon does not exist" }
    }

}

const addPokemonToTeam = async (user_id, receivedData) => {

    let validate = validateAddPokemon(receivedData);
    if (!validate.response) return { response: validate.response, errors: validate.errors }

    const { response, message, teams } = await viewMyTeams(user_id);
    if (!response) return { response: false, message: "No team found!" }

    const team_index = findTeamIndex(receivedData.team_name, teams);
    if (team_index < 0) return { response: false, message: "No team found with given name!" }

    if (teams[team_index].pokemons.length >= 6)
        return { response: false, message: "A team can only have 6 pokemon!" }

    //duplicate pokemon in the team list 

    const pokemon = await pokemonDAO.pokedata(receivedData.pokemon_name);

    const poke = {
        pokemon_name:receivedData.pokemon_name,
        hp:pokemon.data.stats[0].base_stat, 
        attack:pokemon.data.stats[1].base_stat, 
        defense:pokemon.data.stats[2].base_stat, 
        specialattack:pokemon.data.stats[3].base_stat,
        specialdefense:pokemon.data.stats[4].base_stat, 
        speed:pokemon.data.stats[5].base_stat, 
        type:pokemon.data.types
    };

    let data = await pokemonDAO.addPokemonToTeam(team_index, user_id, poke);

    if (data) {
        let index = data.length - 1;
        let pokemon = data[index];
        if (index >= 0) pokemon.index = index;

        return { response: true, message: "New pokemon added", pokemon };
    }

    return { response: false };
}

const deletePokemonFromTeam = async (user_id, team_id, pokemon_id) => {

    const { response, message, teams } = await viewMyTeams(user_id);
    if (!response) return { response: false, message: "No team found!" }

    //duplicate pokemon in the team list 

    let data = await pokemonDAO.deletePokemonFromTeam(user_id, team_id, pokemon_id);

    if (data) {
        return { response: true, message: "deleted pokemon" };
    }

    return { response: false };
}

function findTeamIndex(team_name, teams) {
    return teams.findIndex((team) => team.team_name === team_name);
}

function validateAddPokemon(receivedData) {
    const validator = jsonschema.validate(receivedData, pokemonAddSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        logger.error(errs);
        return { reponse: false, errors: errs }
    }
    return { response: true }
}

module.exports = {
    viewMyTeams,
    getPokemon,
    addPokemonToTeam,
    deletePokemonFromTeam
}