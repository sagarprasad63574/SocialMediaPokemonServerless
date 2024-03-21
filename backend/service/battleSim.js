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

    let deep1 = JSON.parse(JSON.stringify(teams1));
    let deep2 = JSON.parse(JSON.stringify(teams2));

    let team1 = recieved1.pokemons;
    let team2 = recieved2.pokemons;
    if(team1.length == 0)
        return { response: false, message: `${team1[i].team_name} must have at least one pokemon!` }
    if(team2.length == 0)
        return { response: false, message: `${team2[i].team_name} must have at least one pokemon!` }

    for(let i = 0; i < team1.length; i++){
        if(team1[i].moves.length == 0){
            return { response: false, message: `pokemon ${team1[i].pokemon_name} from ${team1[i].team_name} must have at least one move!` }
        }
    }

    for(let i = 0; i < team2.length; i++){
        if(team2[i].moves.length == 0){
            return { response: false, message: `pokemon ${team2[i].pokemon_name} from ${team2[i].team_name} must have at least one move!` }
        }
    }

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
    
    let p1status = {
        status: null,
        turnsleft: 0
    }
    let p2status = {
        status: null,
        turnsleft: 0
    }

    while(!finished)
    {
        console.log(Math.floor(Math.random() * 100)) ;
        let p1speed = p1.speed;
        let p2speed = p2.speed;
        if(p1status.status == "paralysis")
        {
            p1speed = p1speed/2;
        }
        if(p2status.status == "paralysis")
        {
            p2speed = p2speed/2;
        }
        if(p1speed > p2speed)
        {
            if(p1status.name == "paralysis" && Math.floor(Math.random() * 100) < 50)
            {
                detailed.push(`${p1.pokemon_name} is paralyzed and can't move`);
            }
            else if (p1status.name == "freeze")
            {
                detailed.push(`${p1.pokemon_name} is frozen`);
            }
            else if(p1status.name == "sleep")
            {
                detailed.push(`${p1.pokemon_name} is asleep`);
            }
            else if(Math.floor(Math.random() * 100) < p1.moves[p1mc].accuracy)
            {
                if(p1.moves[p1mc].damage_class != "status")
                {
                    let damage = damageCalculation(p1,p2,p1mc);
                    p2.hp = p2.hp - damage;
                    detailed.push(`${p1.pokemon_name} uses ${p1.moves[p1mc].move_name} and deals ${damage} damage`);
                }
                else
                {
                    p2status.status = p1.moves[p1mc].info.ailment.name;
                    p2status.turnsleft = 2;
                    detailed.push(`${p1.pokemon_name} uses ${p1.moves[p1mc].move_name} causes ${p1.moves[p1mc].info.ailment.name}`);
                }
                if(Math.floor(Math.random() * 100) < p1.moves[p1mc].info.flinch_chance)
                {
                    p2status.status = "flinch";
                    p2status.turnsleft = 1;
                    detailed.push(`${p1.moves[p1mc].move_name} causes flinch`);
                }
                if(Math.floor(Math.random() * 100) < p1.moves[p1mc].info.ailment_chance)
                {
                    p2status.status = p1.moves[p1mc].info.ailment.name;
                    p2status.turnsleft = 2;
                    detailed.push(`${p1.moves[p1mc].move_name} causes ${p1.moves[p1mc].info.ailment.name}`);
                }
                if(p1.moves[p1mc].info.drain > 0)
                {
                    let heal = (damage * p1.moves[p1mc].info.drain / 100);
                    p1.hp = p1.hp + heal;
                    detailed.push(`${p1.pokemon_name} heals ${heal}`);
                }
            }
            else
            {
                detailed.push(`${p1.pokemon_name} misses`);
            }

            if(p2.hp <= 0)
            {
                detailed.push(`${p2.pokemon_name} faints`);
                details.push(detailed);
                detailed = [];
                summary.push(`${p2.pokemon_name} faints`);
                team2PokeCounter++;
                p2status.status = null;
                p2status.turnsleft = 0;
                if(team2PokeCounter == team2.length)
                {
                    break;
                }
                else
                {
                    p2 = team2[team2PokeCounter];
                    p1mc = 0;
                    p2mc = 0;
                    continue;
                }
            }

            if(p2status.status == "paralysis" && Math.floor(Math.random() * 100) < 50)
            {
                detailed.push(`${p2.pokemon_name} is paralyzed and can't move`);
            }
            else if (p2status.status == "freeze")
            {
                detailed.push(`${p2.pokemon_name} is frozen`);
            }
            else if(p2status.status == "sleep")
            {
                detailed.push(`${p2.pokemon_name} is asleep`);
            }
            else if(Math.floor(Math.random() * 100) < p2.moves[p2mc].accuracy)
            {
                if(p2.moves[p2mc].damage_class != "status")
                {
                    let damage = damageCalculation(p2,p1,p2mc);
                    p1.hp = p1.hp - damage;
                    detailed.push(`${p2.pokemon_name} uses ${p2.moves[p2mc].move_name} and deals ${damage} damage`);
                }
                else
                {
                    p1status.status = p2.moves[p2mc].info.ailment.name;
                    p1status.turnsleft = 2;
                    detailed.push(`${p2.pokemon_name} uses ${p2.moves[p2mc].move_name} causes ${p2.moves[p2mc].info.ailment.name}`);
                }
                if(Math.floor(Math.random() * 100) < p2.moves[p2mc].info.flinch_chance)
                {
                    p1status.status = "flinch";
                    p1status.turnsleft = 1;
                    detailed.push(`${p2.moves[p2mc].move_name} causes flinch`);
                }
                if(Math.floor(Math.random() * 100) < p2.moves[p2mc].info.ailment_chance)
                {
                    p1status.status = p2.moves[p2mc].info.ailment.name;
                    p1status.turnsleft = 2;
                    detailed.push(`${p2.moves[p2mc].move_name} causes ${p2.moves[p2mc].info.ailment.name}`);
                }
                if(p2.moves[p2mc].info.drain > 0)
                {
                    p2.hp = p2.hp + (damage * p2.moves[p2mc].info.drain / 100)
                }
            }
            else
            {
                detailed.push(`${p2.pokemon_name} misses`);
            }

            if(p1.hp <= 0)
            {
                detailed.push(`${p1.pokemon_name} faints`);
                details.push(detailed);
                detailed = [];
                summary.push(`${p1.pokemon_name} faints`);
                team1PokeCounter++;
                p1status.status = null;
                p1status.turnsleft = 0;
                if(team1PokeCounter == team1.length)
                {
                    won = false;
                    break;
                }
                else
                {
                    p1 = team1[team1PokeCounter];
                    p1mc = 0;
                    p2mc = 0;
                    continue;
                }
            }
        }
        else
        {
            if(p2status.status == "paralysis" && Math.floor(Math.random() * 100) < 50)
            {
                detailed.push(`${p2.pokemon_name} is paralyzed and can't move`);
            }
            else if (p2status.status == "freeze")
            {
                detailed.push(`${p2.pokemon_name} is frozen`);
            }
            else if(p2status.status == "sleep")
            {
                detailed.push(`${p2.pokemon_name} is asleep`);
            }
            else if(Math.floor(Math.random() * 100) < p2.moves[p2mc].accuracy)
            {
                if(p2.moves[p2mc].damage_class != "status")
                {
                    let damage = damageCalculation(p2,p1,p2mc);
                    p1.hp = p1.hp - damage;
                    detailed.push(`${p2.pokemon_name} uses ${p2.moves[p2mc].move_name} and deals ${damage} damage`);
                }
                else
                {
                    p1status.status = p2.moves[p2mc].info.ailment.name;
                    p1status.turnsleft = 2;
                    detailed.push(`${p2.pokemon_name} uses ${p2.moves[p2mc].move_name} causes ${p2.moves[p2mc].info.ailment.name}`);
                }
                if(Math.floor(Math.random() * 100) < p2.moves[p2mc].info.flinch_chance)
                {
                    p1status.status = "flinch";
                    p1status.turnsleft = 1;
                    detailed.push(`${p2.moves[p2mc].move_name} causes flinch`);
                }
                if(Math.floor(Math.random() * 100) < p2.moves[p2mc].info.ailment_chance)
                {
                    p1status.status = p2.moves[p2mc].info.ailment.name;
                    p1status.turnsleft = 2;
                    detailed.push(`${p2.moves[p2mc].move_name} causes ${p2.moves[p2mc].info.ailment.name}`);
                }
                if(p2.moves[p2mc].info.drain > 0)
                {
                    p2.hp = p2.hp + (damage * p2.moves[p2mc].info.drain / 100)
                }
            }
            else
            {
                detailed.push(`${p2.pokemon_name} misses`);
            }
            if(p1.hp <= 0)
            {
                detailed.push(`${p1.pokemon_name} faints`);
                details.push(detailed);
                detailed = [];
                summary.push(`${p1.pokemon_name} faints`);
                team1PokeCounter++;
                p1status.status = null;
                p1status.turnsleft = 0;
                if(team1PokeCounter == team1.length)
                {
                    won = false;
                    break;
                }
                else
                {
                    p1 = team1[team1PokeCounter];
                    p1mc = 0;
                    p2mc = 0;
                    continue;
                }
            }

            if(p1status.status == "paralysis" && Math.floor(Math.random() * 100) < 50)
            {
                detailed.push(`${p1.pokemon_name} is paralyzed and can't move`);
            }
            else if (p1status.status == "freeze")
            {
                detailed.push(`${p1.pokemon_name} is frozen`);
            }
            else if(p1status.status == "sleep")
            {
                detailed.push(`${p1.pokemon_name} is asleep`);
            }
            else if(Math.floor(Math.random() * 100) < p1.moves[p1mc].accuracy)
            {
                if(p1.moves[p1mc].damage_class != "status")
                {
                    let damage = damageCalculation(p1,p2,p1mc);
                    p2.hp = p2.hp - damage;
                    detailed.push(`${p1.pokemon_name} uses ${p1.moves[p1mc].move_name} and deals ${damage} damage`);
                }
                else
                {
                    p2status.status = p1.moves[p1mc].info.ailment.name;
                    p2status.turnsleft = 2;
                    detailed.push(`${p1.pokemon_name} uses ${p1.moves[p1mc].move_name} causes ${p1.moves[p1mc].info.ailment.name}`);
                }
                if(Math.floor(Math.random() * 100) < p1.moves[p1mc].info.flinch_chance)
                {
                    p2status.status = "flinch";
                    p2status.turnsleft = 1;
                    detailed.push(`${p1.moves[p1mc].move_name} causes flinch`);
                }
                if(Math.floor(Math.random() * 100) < p1.moves[p1mc].info.ailment_chance)
                {
                    p2status.status = p1.moves[p1mc].info.ailment.name;
                    p2status.turnsleft = 2;
                    detailed.push(`${p1.moves[p1mc].move_name} causes ${p1.moves[p1mc].info.ailment.name}`);
                }
                if(p1.moves[p1mc].info.drain > 0)
                {
                    let heal = (damage * p1.moves[p1mc].info.drain / 100);
                    p1.hp = p1.hp + heal;
                    detailed.push(`${p1.pokemon_name} heals ${heal}`);
                }
            }
            else
            {
                detailed.push(`${p1.pokemon_name} misses`);
            }
            if(p2.hp <= 0)
            {
                detailed.push(`${p2.pokemon_name} faints`);
                details.push(detailed);
                detailed = [];
                summary.push(`${p2.pokemon_name} faints`);
                team2PokeCounter++;
                p2status.status = null;
                p2status.turnsleft = 0;
                if(team2PokeCounter == team2.length)
                {
                    break;
                }
                else
                {
                    p2 = team2[team2PokeCounter];
                    p1mc = 0;
                    p2mc = 0;
                    continue;
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

        if(p1status.status == "burn" || p1.status == "poison")
        {
            let damage = (deep1[user_team_index].pokemons[team1PokeCounter].hp * 1/8);
            p1.hp = p1.hp - damage;
            detailed.push(`${p1.pokemon_name} takes ${damage} from ${p1status.status}`);
        }
        if(p2status.status == "burn" || p2.status == "poison")
        {
            let damage = (deep1[opponent_team_index].pokemons[team2PokeCounter].hp * 1/8);
            p2.hp = p2.hp - damage;
            detailed.push(`${p2.pokemon_name} takes ${damage} from ${p2status.status}`);
        }
        
        if(p1status.status != null)
        {
            p1status.turnsleft--;
            if(p1status.turnsleft == 0)
            {
                p1status.status = null;
            }
        }
        if(p2status.status != null)
        {
            p2status.turnsleft--;
            if(p2status.turnsleft == 0)
            {
                p2status.status = null;
            }
        }
    }

    let mess = "";
    let points = ((team1.length + team2.length) - details.length);
    recieved1 = deep1[user_team_index];
    recieved2 = deep2[opponent_team_index];

    if(won)
    {
        recieved1.win += 1;
        recieved1.points += points;
        let battleReport = {summary,details,won};
        recieved1.battlelog.push(battleReport);
        await battleSimDAO.addDetails(user_team_index, user_id, recieved1);
        recieved2.loss += 1;
        recieved2.points -= points;
        if(recieved2.points < 0)
            recieved2.points = 0;
        won = false;
        battleReport = {summary,details,won};
        recieved2.battlelog.push(battleReport);
        await battleSimDAO.addDetails(opponent_team_index, receivedData.opponent_id, recieved2);
        mess = "You Won!";
    }
    else
    {
        recieved2.win += 1;
        recieved2.points += points;
        let battleReport = {summary,details,won};
        recieved2.battlelog.push(battleReport);
        await battleSimDAO.addDetails(opponent_team_index, receivedData.opponent_id, recieved2);
        recieved1.loss += 1;
        recieved1.points -= points;
        if(recieved1.points < 0)
            recieved1.points = 0;
        won = true;
        battleReport = {summary,details,won};
        recieved1.battlelog.push(battleReport);
        await battleSimDAO.addDetails(user_team_index, user_id, recieved1);
        mess = "You Lost!";
    }

    return {response: true, details: details, summary: summary, message: mess};
};

function damageCalculation(attackPokemon, defendPokemon, moveCount)
{
    let damage = 0;
    if(attackPokemon.moves[moveCount].damage_class == "special")
        damage = (attackPokemon.moves[moveCount].power * (attackPokemon.specialattack/defendPokemon.specialdefense)/50) + 2;
    else
        damage = (attackPokemon.moves[moveCount].power * (attackPokemon.attack/defendPokemon.defense)/50) + 2;
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