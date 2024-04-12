import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jwt from 'jsonwebtoken';
import axios from 'axios';

const client = new DynamoDBClient({ region: 'us-west-1' });
const documentClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {

    const authenicateUser = authenticateUser(event);
    if (!authenicateUser.response) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: authenicateUser.message,
            }),
        };
    }

    const user_id = authenicateUser.user.id;
    const team_id = event.pathParameters.teamid;
    const pokemon_id = event.pathParameters.pokeid;
    const receivedData = JSON.parse(event.body);

    const { response, message, team } = await addMoveToPokemon(user_id, team_id, pokemon_id, receivedData);
    if (response) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                response,
                message,
                team
            })
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            response,
            message
        })
    }
};

const authenticateUser = (event) => {
    try {
        const authHeader = event.headers && event.headers.Authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                return {
                    response: true,
                    user: user,
                }
            } catch {
                return {
                    response: false,
                    message: "Unauthorized",
                }
            }
        } else {
            return {
                response: false,
                message: "Unauthorized",
            }
        }
    } catch (err) {
        return {
            response: false,
            message: err.message,
        }
    }
};

const addMoveToPokemon = async (user_id, team_id, pokemon_id, receivedData) => {

    const { response, message, teams } = await viewMyTeams(user_id);
    if (!response) return { response: false, message: "No team found!" }

    if(!teams[team_id].pokemons[pokemon_id].mypokemon)
    {
        const checkmove = await pokedata(teams[team_id].pokemons[pokemon_id].pokemon_name);

        let movefound = false;
        for(let i = 0; i < checkmove.data.moves.length; i++)
        {
            if(receivedData.move_name == checkmove.data.moves[i].move.name)
            {
                movefound = true;
                break
            }
        }
        if(!movefound)
        {
            return { response: false, message: `${teams[team_id].pokemons[pokemon_id].pokemon_name} cannot learn ${receivedData.move_name}` };
        }
    }

    const pokemove = await addPokeMove(receivedData.move_name);

    if(pokemove.data.generation.name != "generation-i")
    {
        return { response: false, message: `Move must be a generation 1 move!` };
    }

    if(pokemove.data.damage_class.name != "physical" && pokemove.data.damage_class.name != "special")
    {
        return { response: false, message: `Move must either physical or special!` };
    }

    const pokemonMove = 
    {
        name:receivedData.move_name,
        accuracy:pokemove.data.accuracy,
        power:pokemove.data.power,
        type:pokemove.data.type.name,
        info:pokemove.data.meta,
        damage_class:pokemove.data.damage_class.name
    }

    const data = await addMoveToPokemonDAO(user_id, team_id, pokemon_id, pokemonMove);

    if (data) {
        return { response: true, message: "added move" };
    }

    return { response: false };
}

const viewMyTeams = async (user_id) => {
    let teams = await ViewUsersTeams(user_id);
    if (teams.length == 0) {
        return { response: false, message: "No teams found!" };
    }
    return { response: true, message: "My teams", teams };
}

const pokedata = async (pokiemon) => {
    try
    {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokiemon}/`;
        const pokemon = await axios.get(url);
        return pokemon;
    }
    catch (error) {
        return null;
    }
}

const addPokeMove = async (move) => {
    try
    {
        const url = `https://pokeapi.co/api/v2/move/${move}/`;
        const move2 = await axios.get(url);
        return move2;
    }
    catch (error) {
        return null;
    }
}

const ViewUsersTeams = async (user_id) => {
    const command = new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression:
            "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": user_id,
        },
        ConsistentRead: true,
    });

    try {
        const data = await documentClient.send(command);
        return data.Items[0].teams;
    } catch (error) {
        return null;
    }
}

const addMoveToPokemonDAO = async (user_id, team_index, pokemon_index, pokemon) => {
    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            user_id
        },
        UpdateExpression: `SET teams[${team_index}].pokemons[${pokemon_index}].moves = list_append(teams[${team_index}].pokemons[${pokemon_index}].moves, :vals)`,
        ExpressionAttributeValues: {

            ":vals": [
                {
                    "move_name": pokemon.name,
                    "accuracy": pokemon.accuracy,
                    "type": pokemon.type,
                    "power": pokemon.power,
                    "info": pokemon.info,
                    "damage_class": pokemon.damage_class
                }
            ]

        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes.teams[0].pokemons;
    } catch (error) {
        return null;
    }
}