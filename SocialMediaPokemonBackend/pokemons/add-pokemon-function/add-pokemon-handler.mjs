import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jwt from 'jsonwebtoken';
import jsonschema from 'jsonschema';
import { v4 as uuidv4 } from 'uuid';
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
    const receivedData = JSON.parse(event.body);

    const { response, message, pokemon } = await addPokemonToTeam(user_id, receivedData);
    if (response) {
        return {
            statusCode: 201,
            body: JSON.stringify({
                response,
                message,
                pokemon
            })
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            response,
            message,
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

const addPokemonToTeam = async (user_id, receivedData) => {

    let validate = validateAddPokemon(receivedData);
    if (!validate.response) return { response: validate.response, errors: validate.errors }

    const { response, teams } = await viewMyTeams(user_id);
    if (!response) return { response: false, message: "No team found!" }

    const team_index = findTeamIndex(receivedData.team_name, teams);
    if (team_index < 0) return { response: false, message: "No team found with given name!" }

    if (teams[team_index].pokemons.length >= 6)
        return { response: false, message: "A team can only have 6 pokemon!" }

    const pokemon_id = uuidv4();
    const pokemon = await pokedata(receivedData.pokemon_name);

    if (pokemon == null)
        return { response: false, message: "Pokemon does not exist" };

    const poke = {
        pokemon_id: pokemon_id,
        pokemon_name: receivedData.pokemon_name,
        hp: pokemon.data.stats[0].base_stat,
        attack: pokemon.data.stats[1].base_stat,
        defense: pokemon.data.stats[2].base_stat,
        specialattack: pokemon.data.stats[3].base_stat,
        specialdefense: pokemon.data.stats[4].base_stat,
        speed: pokemon.data.stats[5].base_stat,
        type: pokemon.data.types,
        sprite: pokemon.data.sprites.front_default,
        moves: []
    };

    let data = await addPokemonToTeamDAO(team_index, user_id, poke);

    if (data) {
        let index = data.length - 1;
        let pokemon = data[index];
        if (index >= 0) pokemon.index = index;

        return { response: true, message: "New pokemon added", pokemon };
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

function findTeamIndex(team_name, teams) {
    return teams.findIndex((team) => team.team_name === team_name);
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

const addPokemonToTeamDAO = async (team_index, user_id, pokemon) => {
    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            user_id
        },
        UpdateExpression: `SET teams[${team_index}].pokemons = list_append(teams[${team_index}].pokemons, :vals)`,
        ExpressionAttributeValues: {

            ":vals": [
                {   
                    "pokemon_id": pokemon.pokemon_id, 
                    "pokemon_name": pokemon.pokemon_name,
                    "hp": pokemon.hp,
                    "attack": pokemon.attack,
                    "defense": pokemon.defense,
                    "specialattack":pokemon.specialattack,
                    "specialdefense":pokemon.specialdefense, 
                    "speed":pokemon.speed, 
                    "type":pokemon.type,
                    "sprite":pokemon.sprite,
                    "mypokemon":false,
                    "moves":pokemon.moves
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

function validateAddPokemon(receivedData) {
    const validator = jsonschema.validate(receivedData, pokemonAddSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        return { response: false, errors: errs }
    }
    return { response: true }
}

const pokemonAddSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/example.json",
    "type": "object",
    "properties": {
        "team_name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 30
        },
        "pokemon_name": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": [
        "team_name",
        "pokemon_name"
    ]
}