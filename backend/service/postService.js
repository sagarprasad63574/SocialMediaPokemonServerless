const postDAO = require('../repository/postDAO');
const logger = require('../util/logger');
const teamDAO = require('../repository/teamDAO');

const viewAllPostedTeams = async () => {

    const users = await postDAO.ViewAllUsersTeams();
    const teams = users.map((user, index) => {
        const postedTeams = user.teams.filter((team, index) => team.post === true);
        if (postedTeams.length > 0) return { user_id: user.user_id, name: user.name, username: user.username, teams: postedTeams }

    }).filter((team, index) => team);

    return { response: true, message: "Posted Teams", teams };
}

const postTeam = async (user_id, team_id) => {
    const { response, message, team } = await viewTeamById(user_id, team_id);
    if (!response) return { response, message };

    if (team.post === true) return { response: false, message: "Team already posted!", team}

    const postTeam = await postDAO.postTeam(user_id, team_id);

    return { response: true, message: "Team posted!" }
}

const viewMyTeams = async (user_id) => {

    const teams = await teamDAO.ViewUsersTeams(user_id);
    if (teams.length == 0) {
        return { response: false, message: "No teams found!" };
    }
    return { response: true, message: "My teams", teams };
}

const viewTeamById = async (user_id, team_id) => {
    const { response, message, teams } = await viewMyTeams(user_id);
    if (!response) return { response, message }

    const team = teams[team_id];

    if (response && team) {
        return { response, team }
    }

    return { response: false, message: `No team found with id ${team_id}` }

}

const viewTeamByIdFromAll = async team_id => {
    const {response, message, teams} = await viewAllPostedTeams();
    if(!response) return {response, message};
    const userObjs = teams;
    let teamObj;
    let foundUsername;
    for(let i=0; i<userObjs.length; i++){
        userObjs[i].teams.forEach(team => {
            if(team.team_id === team_id){
                teamObj = team;
                foundUsername = userObjs[i].username
            }
        });
    }
    if(!foundUsername || !teamObj){
        return {response: false, message: `No team found with id ${team_id}`};
    }
    let foundTeam = {
        username: foundUsername,
        team: teamObj
    };
    if(response && foundTeam){
        return {response, message: `Got team with team id ${team_id}`, foundTeam};
    }
    return {response: false, message: `No team found with id ${team_id}`};
}

module.exports = {
    viewAllPostedTeams,
    postTeam,
    viewTeamByIdFromAll
}