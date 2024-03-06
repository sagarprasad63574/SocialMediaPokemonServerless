const jsonschema = require('jsonschema');
const uuid = require('uuid');
const teamDAO = require('../repository/teamDAO');
const teamAddSchema = require('../schemas/teamAddSchema.json');
const logger = require('../util/logger');

const addTeam = async (team_name) => {

    //let { response, errors } = validateTeam(team_id);
    //if (!response) return { response: false, errors: errors }
    const user_id = "0"; 
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
            team_name,
            win,
            loss,
            points,
            pokemons,
            battlelog
        });

    if (data) {
        // let index = data.length - 1;
        // let ticket = data[index];
        // if (index >= 0) ticket.index = index;

        // return { response: true, ticket, user };
        console.log(data);
    }

    return { response: false };

}

module.exports = {
    addTeam
}