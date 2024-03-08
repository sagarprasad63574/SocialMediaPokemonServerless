const jsonschema = require('jsonschema');
const uuid = require('uuid');
const teamDAO = require('../repository/teamDAO');
const teamAddSchema = require('../schemas/teamAddSchema.json');
const pokemonAddSchema = require('../schemas/pokemonAddSchema.json');
const logger = require('../util/logger');

const addTeam = async (user_id, receivedData) => {

    let { response, errors } = validateTeam(receivedData);
    if (!response) return { response: false, errors: errors }

    //check for duplicated team_name
    const duplicateTeamName = await checkDuplicatedTeamName(user_id, receivedData.team_name); 
    if (duplicateTeamName.response) return { response: false, errors: duplicateTeamName.message}

    const team_id = uuid.v4();
    const win = 0;
    const loss = 0;
    const points = 0;
    const pokemons = [];
    const battlelog = [];

    let data = await teamDAO.createTeam(
        user_id,
        {
            team_id,
            team_name: receivedData.team_name,
            win,
            loss,
            points,
            pokemons,
            battlelog
        });

    if (data) {
        let index = data.length - 1;
        let teams = data[index];
        if (index >= 0) teams.index = index;

        return { response: true, message: "New team created", teams };
    }

    return { response: false };

}

function validateTeam(receivedData) {
    const validator = jsonschema.validate(receivedData, teamAddSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        logger.error(errs);
        return { reponse: false, errors: errs }
    }
    return { response: true }
}

async function checkDuplicatedTeamName(user_id, team_name) {
    const { response, message, teams } = await viewMyTeams(user_id); 
    if (!response) return { response: false, message: "No teams found!"};
    
    const findIndex = findTeamIndexToAddPokemon(team_name, teams);

    if (findIndex >= 0) return { response: true, message: "Duplicated team name"}

    return { response: false}
}

const viewMyTeams = async (user_id) => {

    let teams = await teamDAO.ViewUsersTeams(user_id);

    if (teams.length) {
        return { response: true, message: "My teams", teams };
    }
    return { response: false, message: "No teams found!" };

}

const viewTeamById = async (user_id, team_id) => {
    const {response, teams} = await viewMyTeams(user_id);
    const team = teams[team_id];

    if (response && team) {
       return { response, team}
    }
    return { response: false, message: `No team found with id ${team_id}`}
}
const addPokemonToTeam = async (user_id, receivedData) => {

    let validate = validateAddPokemon(receivedData);
    if (!validate.response) return { response: validate.response, errors: validate.errors }

    const { response, message, teams } = await viewMyTeams(user_id);
    if (!response) return { response: false, message: "No team found!" }

    const team_index = findTeamIndexToAddPokemon(receivedData.team_name, teams);
    if (team_index < 0) return { response: false, message: "No team found with given name!" }

    if(teams[team_index].pokemons.length >= 6)
    return { response: false, message: "A team can only have 6 pokemon!" }

    //duplicate pokemon in the team list 

    let data = await teamDAO.addPokemonToTeam(team_index, user_id, {
        pokemon_id: receivedData.pokemon_id,
        pokemon_name: receivedData.pokemon_name
    });

    if (data) {
        let index = data.length - 1;
        let pokemon = data[index];
        if (index >= 0) pokemon.index = index;

        return { response: true, message: "New pokemon added", pokemon };
    }

    return { response: false };
}

function findTeamIndexToAddPokemon(team_name, teams) {
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
    addTeam,
    viewMyTeams,
    viewTeamById,
    addPokemonToTeam
}