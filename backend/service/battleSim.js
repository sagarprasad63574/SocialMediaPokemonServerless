const teamDAO = require('../repository/teamDAO');
const battleSimDAO = require('../repository/battleSimDAO');

function findTeamIndex(team_name, teams) {
    return teams.findIndex((team) => team.team_name === team_name);
}

const battleSim = async (user_id, receivedData) =>
{

    let finished = false;

    let teams1 = await teamDAO.ViewUsersTeams(user_id);

    const user_team_index = findTeamIndex(receivedData.user_team_name, teams1);
    if (user_team_index < 0) return { response: false, message: "No user team found with given name!" }

    let recieved1 = teams1[user_team_index];

    let teams2 = await teamDAO.ViewUsersTeams(receivedData.opponent_id);

    const opponent_team_index = findTeamIndex(receivedData.opponent_team_name, teams2);
    if (opponent_team_index < 0) return { response: false, message: "No user team found with given name!" }

    let recieved2 = teams2[opponent_team_index];

    let team1 = recieved1.pokemons;
    let team2 = recieved2.pokemons;

    let t1 = team1.length;
    let t2 = team2.length;

    let c1 = 0;
    let c2 = 0;

    let p1 = team1[0];
    let p2 = team2[0];

    let team1PokeCounter = 0;
    let team2PokeCounter = 0;

    let p1mc = 0;
    let p2mc = 0;

    let detailed = [];
    let details = [];
    let summary = [];

    let won = true;

    while(!finished)
    {
        if(p1.speed > p2.speed)
        {
            let damage = damageCalculation(p1,p2,p1mc);
            p2.hp = p2.hp - damage;
            detailed.push(`${p1.pokemon_name} uses ${p1.moves[p1mc].move_name} and deals ${damage} damage`);
            if(p2.hp <= 0)
            {
                detailed.push(`${p2.pokemon_name} faints`);
                details.push(detailed);
                detailed = [];
                summary.push(`${p2.pokemon_name} faints`);
                team2PokeCounter++;
                if(team2PokeCounter == team2.length)
                {
                    break;
                }
                else
                {
                    p2 = team2[team2PokeCounter];
                    p2mc = -1;
                }
            }
            damage = damageCalculation(p2,p1,p2mc);
            p1.hp = p1.hp - damage;
            detailed.push(`${p2.pokemon_name} uses ${p2.moves[p2mc].move_name} and deals ${damage} damage`);
            if(p1.hp <= 0)
            {
                detailed.push(`${p1.pokemon_name} faints`);
                details.push(detailed);
                detailed = [];
                summary.push(`${p1.pokemon_name} faints`);
                team1PokeCounter++;
                if(team1PokeCounter == team1.length)
                {
                    won = false;
                    break;
                }
                else
                {
                    p1 = team1[team1PokeCounter];
                    p1mc = -1;
                }
            }
        }
        else
        {
            let damage = damageCalculation(p2,p1,p2mc);
            p1.hp = p1.hp - damage;
            detailed.push(`${p2.pokemon_name} uses ${p2.moves[p2mc].move_name} and deals ${damage} damage`);
            if(p1.hp <= 0)
            {
                detailed.push(`${p1.pokemon_name} faints`);
                details.push(detailed);
                detailed = [];
                summary.push(`${p1.pokemon_name} faints`);
                team1PokeCounter++;
                if(team1PokeCounter == team1.length)
                {
                    won = false;
                    break;
                }
                else
                {
                    p1 = team1[team1PokeCounter];
                    p1mc = -1;
                }
            }

            damage = damageCalculation(p1,p2,p1mc);
            p2.hp = p2.hp - damage;
            detailed.push(`${p1.pokemon_name} uses ${p1.moves[p1mc].move_name} and deals ${damage} damage`);
            if(p2.hp <= 0)
            {
                detailed.push(`${p2.pokemon_name} faints`);
                details.push(detailed);
                detailed = [];
                summary.push(`${p2.pokemon_name} faints`);
                team2PokeCounter++;
                if(team2PokeCounter == team2.length)
                {
                    break;
                }
                else
                {
                    p2 = team2[team2PokeCounter];
                    p2mc = -1;
                }
            }
        }
        p1mc++;
        p2mc++;
        if(p1mc == p1.moves.length)
        {
            p1mc = 0;
        }
        if(p2mc == p2.moves.length)
        {
            p2mc = 0;
        }
    }
    let mess = "";
    if(won)
    {
        mess = "You Won!";
    }
    else
    {
        mess = "You Lost!";
    }
    let battleReport = {summary,details,won};
    recieved1 = await battleSimDAO.addBattleReport(user_team_index, user_id, battleReport);
    if(won)
        won = false;
    else
        won = true;
    battleReport = {summary,details,won};
    recieved2 = await battleSimDAO.addBattleReport(opponent_team_index, receivedData.opponent_id, battleReport);
    return {response: true, details: details, summary: summary, message: mess};
};

function damageCalculation(attackPokemon, defendPokemon, moveCount)
{
    let damage = (attackPokemon.moves[moveCount].power * (attackPokemon.attack/defendPokemon.defense)/50) + 2;
    if(attackPokemon.moves[moveCount].type == attackPokemon.type[0].type.name)
        damage = damage * 1.5;
    if(attackPokemon.type.length == 2)
        if(attackPokemon.moves[moveCount].type == attackPokemon.type[1].type.name)
            damage = damage * 1.5;
    damage = damage * typeCalculation(attackPokemon.moves[moveCount].type,defendPokemon.type[0].type.name);
    if(defendPokemon.type.length == 2)
        damage = damage * typeCalculation(attackPokemon.moves[moveCount].type,defendPokemon.type[1].type.name);

    return damage;
};

function typeCalculation(type1, type2)
{
    switch(type1)
    {
        case "normal":
            switch(type2) {
                case "rock":
                  return .5;
                case "steel":
                  return .5;
                case "ghost":
                  
                default:
                  return 1;
            }
        case "fire":
            switch(type2) {
                case "fire":
                    return .5;
                case "water":
                    return .5;
                case "grass":
                    return 2;
                case "ice":
                    return 2;
                case "bug":
                    return 2;
                case "rock":
                    return .5;
                case "dragon":
                    return .5;
                default:
                    return 1;
            }
        case "water":
            switch(type2) {
                case "fire":
                    return 2;
                case "water":
                    return .5;
                case "grass":
                    return .5;
                case "ground":
                    return 2;
                case "rock":
                    return 2;
                case "dragon":
                    return .5;
                default:
                    return 1;
            }
        case "electric":
            switch(type2) {
                case "water":
                    return 2;
                case "electric":
                    return .5;
                case "grass":
                    return 2;
                case "ground":
                    return 0;
                case "dragon":
                    return .5;
                default:
                    return 1;
            }
        case "grass":
            switch(type2) {
                case "fire":
                    return .5;
                case "water":
                    return 2;
                case "grass":
                    return .5;
                case "poison":
                    return .5;
                case "ground":
                    return 2;
                case "flying":
                    return .5;
                case "bug":
                    return .5;
                case "rock":
                    return 2;
                case "dragon":
                    return .5;
                case "steel":
                    return .5;
                default:
                    return 1;
            }
        case "ice":
            switch(type2) {
                case "fire":
                    return .5;
                case "water":
                    return .5;
                case "grass":
                    return 2;
                case "ice":
                    return .5;
                case "ground":
                    return 2;
                case "flying":
                    return 2;
                case "dragon":
                    return 2;
                case "steel":
                    return .5;
                default:
                    return 1;
            }
        case "fighting":
            switch(type2) {
                case "normal":
                    return 2;
                case "ice":
                    return 2;
                case "poison":
                    return .5;
                case "flying":
                    return .5;
                case "psychic":
                    return .5;
                case "bug":
                    return .5;
                case "rock":
                    return 2;
                case "ghost":
                    return 0;
                case "dark":
                    return 2;
                case "steel":
                    return 2;
                case "fairy":
                    return .5;
                default:
                    return 1;
            }
        case "poison":
            switch(type2) {
                case "grass":
                    return 2;
                case "poison":
                    return .5;
                case "ground":
                    return .5;
                case "rock":
                    return .5;
                case "ghost":
                    return .5;
                case "steel":
                    return 0;
                case "fairy":
                    return 2;
                default:
                    return 1;
            }
        case "ground":
            switch(type2) {
                case "fire":
                    return 2;
                case "electric":
                    return 2;
                case "grass":
                    return .5;
                case "poison":
                    return 2;
                case "flying":
                    return 0;
                case "bug":
                    return .5;
                case "rock":
                    return 2;
                case "steel":
                    return 2;
                default:
                    return 1;
            }
        case "flying":
            switch(type2) {
                case "electric":
                    return .5;
                case "grass":
                    return 2;
                case "fighting":
                    return 2;
                case "bug":
                    return 2;
                case "rock":
                    return .5;
                case "steel":
                    return .5;
                default:
                    return 1;
            }
        case "psychic":
            switch(type2) {
                case "fighting":
                    return 2;
                case "poison":
                    return 2;
                case "psychic":
                    return .5;
                case "dark":
                    return 0;
                case "steel":
                    return .5;
                default:
                    return 1;
            }
        case "bug":
            switch(type2) {
                case "fire":
                    return .5;
                case "grass":
                    return 2;
                case "fighting":
                    return .5;
                case "poison":
                    return .5;
                case "flying":
                    return .5;
                case "psychic":
                    return 2;
                case "ghost":
                    return .5;
                case "dark":
                    return 2;
                case "steel":
                    return .5;
                case "fairy":
                    return .5;
                default:
                    return 1;
            }
        case "rock":
            switch(type2) {
                case "fire":
                    return 2;
                case "ice":
                    return 2;
                case "fighting":
                    return .5;
                case "ground":
                    return .5;
                case "flying":
                    return 2;
                case "bug":
                    return 2;
                case "steel":
                    return .5;
                default:
                    return 1;
            }
        case "ghost":
            switch(type2) {
                case "normal":
                    return 0;
                case "psychic":
                    return 2;
                case "ghost":
                    return 2;
                case "dark":
                    return .5;
                default:
                    return 1;
            }
        case "dragon":
            switch(type2) {
                case "dragon":
                    return 2;
                case "steel":
                    return .5;
                case "fairy":
                    return 0;
                default:
                    return 1;
            }
        case "dark":
            switch(type2) {
                case "fighting":
                    return .5;
                case "psychic":
                    return 2;
                case "ghost":
                    return 2;
                case "dark":
                    return .5;
                case "fairy":
                    return .5;
                default:
                    return 1;
            }
        case "steel":
            switch(type2) {
                case "fire":
                    return .5;
                case "water":
                    return .5;
                case "electric":
                    return .5;
                case "ice":
                    return 2;
                case "rock":
                    return 2;
                case "steel":
                    return .5;
                case "fairy":
                    return 2;
                default:
                    return 1;
            }
        case "fairy":
            switch(type2) {
                case "fire":
                    return .5;
                case "fighting":
                    return 2;
                case "poison":
                    return .5;
                case "dragon":
                    return 2;
                case "dark":
                    return 2;
                case "steel":
                    return .5;
                default:
                    return 1;
            }
    }
};

module.exports = {
    battleSim
}