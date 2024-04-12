import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jwt from 'jsonwebtoken';
import jsonschema from 'jsonschema';

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
    const pokemon_id = event.pathParameters.id;
    const receivedData = JSON.parse(event.body);

    const { response, message, data } = await addPokemonToTeam(user_id, pokemon_id, receivedData);

    if (response) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                response,
                message,
                pokemon: data
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

const addPokemonToTeam = async (user_id, pokemon_id, receivedData) => {
    let validate = validateAddPokemon(receivedData);
    if (!validate.response) return { response: validate.response, message: validate.errors }

    const { response, teams } = await viewMyTeams(user_id);
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

    let data = await addPokemonToTeamDAO(user_id, team_index, poke);

    if (data) { return { response: true, message: `New pokemon added to team: ${findTeam.team[0].team_name}`, data } }

    return { response: false, message: "Cannot add to team" };
}

function findTeamIndexToAddPokemon(team_name, teams) {
    return teams.findIndex((team) => team.team_name === team_name);
}

const viewTeamByName = async (user_id, team_name) => {
    const { response, message, teams } = await viewMyTeams(user_id);
    if (!response) return { response, message }

    const team = teams.filter((team, index) => (team.team_name === team_name))
    if (team.length == 0) return {response: false, message: `No team found with team name ${team_name}`}

    return { response: true, team }

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

const viewMyCreatedPokemons = async (user_id) => {
    let pokemons = await ViewMyPokemons(user_id);
    if (pokemons.length == 0) {
        return { response: false, message: "No pokemons found!" };
    }
    return { response: true, message: "My pokemons", pokemons };
}

const viewMyTeams = async (user_id) => {
    let teams = await ViewUsersTeams(user_id);
    if (teams.length == 0) {
        return { response: false, message: "No teams found!" };
    }
    return { response: true, message: "My teams", teams };
}

const ViewMyPokemons = async (user_id) => {
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
        return data.Items[0].my_pokemons;
    } catch (error) {
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

const addPokemonToTeamDAO = async (user_id, team_index, pokemon) => {
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
                    "attack": pokemon.attack,
                    "defense": pokemon.defense,
                    "specialattack":pokemon.specialattack,
                    "specialdefense":pokemon.specialdefense, 
                    "speed":pokemon.speed, 
                    "hp": pokemon.hp,
                    "type":pokemon.type,
                    "sprite":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
                    "mypokemon":true,
                    "moves":pokemon.moves,
                    
                }
            ]

        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes.teams[0].pokemons[0];
    } catch (error) {
        return null;
    }
}

function validateAddPokemon(receivedData) {
    const validator = jsonschema.validate(receivedData, createdAddPokemonSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack.substring(9));
        return { reponse: false, errors: errs }
    }
    return { response: true }
}

const createdAddPokemonSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/example.json",
    "type": "object",
    "properties": {
        "team_name": {
            "type": "string",
            "minLength": 5,
            "maxLength": 30
        }
    },
    "additionalProperties": false,
    "required": [
        "team_name"
    ]
}