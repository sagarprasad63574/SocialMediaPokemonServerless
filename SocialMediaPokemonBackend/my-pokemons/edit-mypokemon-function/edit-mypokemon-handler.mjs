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

    const { response, message, pokemon } = await editMyPokemon(user_id, pokemon_id, receivedData);

    if (response) {
        return {
            statusCode: 200,
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

const editMyPokemon = async (user_id, pokemon_index, receivedData) => {

    let { response, errors } = validateEditMyPokemon(receivedData);
    if (!response) return { response: false, message: errors }

    const getMyPokemon = await viewMyPokemonsById(user_id, pokemon_index);
    if (!getMyPokemon.response) return { response: getMyPokemon.response, message: getMyPokemon.message };

    const duplicatePokemonName = await checkDuplicatedPokemonName(user_id, receivedData.pokemon_name);
    if (duplicatePokemonName.response) return { response: false, message: duplicatePokemonName.message };

    let pokemon = await editMyPokemonDAO(
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

const viewMyPokemonsById = async (user_id, pokemon_index) => {
    const { response, message, pokemons } = await viewMyCreatedPokemons(user_id);
    if (!response) return { response, message }

    const pokemon = pokemons[pokemon_index];

    if (response && pokemon) {
        return { response, pokemon }
    }
    return { response: false, message: `No pokemon found with id ${pokemon_index}` }
}

async function checkDuplicatedPokemonName(user_id, pokemon_name) {
    const { response, pokemons } = await viewMyCreatedPokemons(user_id);
    if (!response) return { response: false, message: "No pokemons found!" };

    const findPokemon = pokemons.find(pokemon => pokemon.pokemon_name === pokemon_name);
    if (!findPokemon) return { response: false }
    return { response: true, message: "Duplicate pokemon name" }
}

const viewMyCreatedPokemons = async (user_id) => {
    let pokemons = await ViewMyPokemons(user_id);
    if (pokemons.length == 0) {
        return { response: false, message: "No pokemons found!" };
    }
    return { response: true, message: "My pokemons", pokemons };
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

const editMyPokemonDAO = async (user_id, pokemon_index, pokemon) => {
    console.log(pokemon);
    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            user_id
        },
        UpdateExpression: `SET my_pokemons[${pokemon_index}] = :vals`,
        ExpressionAttributeValues: {

            ":vals": {
                "pokemon_name": pokemon.pokemon_name,
                "hp": pokemon.hp,
                "attack": pokemon.attack,
                "defense": pokemon.defense,
                "specialattack": pokemon.specialattack,
                "specialdefense": pokemon.specialdefense,
                "speed": pokemon.speed
            }

        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes.my_pokemons[0];
    } catch (error) {
        return null;
    }
}

function validateEditMyPokemon(receivedData) {
    const validator = jsonschema.validate(receivedData, createPokemonSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack.substring(9));
        return { response: false, errors: errs }
    }
    return { response: true }
}

const createPokemonSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/example.json",
    "type": "object",
    "properties": {
        "pokemon_name": {
            "type": "string"
        },
        "attack": {
            "type": "number"
        },
        "defense": {
            "type": "number"
        },
        "specialattack": {
            "type": "number"
        },
        "specialdefense": {
            "type": "number"
        },
        "speed": {
            "type": "number"
        },
        "hp": {
            "type": "number"
        }
    },
    "additionalProperties": false,
    "required": [
        "pokemon_name",
        "attack",
        "defense",
        "specialattack",
        "specialdefense",
        "speed",
        "hp"
    ]
}