import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jwt from 'jsonwebtoken';
import jsonschema from 'jsonschema';
import { v4 as uuidv4 } from 'uuid';

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

    const { response, message, pokemon } = await createMyPokemon(user_id, receivedData);

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

const createMyPokemon = async (user_id, receivedData) => {

    let validPokemon = validatePokemon(receivedData);
    if (!validPokemon.response) return { response: false, message: validPokemon.errors }

    const duplicatePokemonName = await checkDuplicatedPokemonName(user_id, receivedData.pokemon_name);
    if (duplicatePokemonName.response) return { response: false, message: duplicatePokemonName.message }

    const pokemon_id = uuidv4();

    let data = await createMyPokemonDAO(
        user_id,
        {
            pokemon_id,
            pokemon_name: receivedData.pokemon_name,
            attack: receivedData.attack,
            defense: receivedData.defense,
            specialattack: receivedData.specialattack,
            specialdefense: receivedData.specialdefense,
            speed: receivedData.speed,
            hp: receivedData.hp,
            type: [
                {
                    type: {
                        name: "normal"
                    },
                    slot: 1
                }
            ],
            moves: []
        });


    if (data) {
        let index = data.length - 1;
        let pokemon = data[index];
        if (index >= 0) pokemon.index = index;

        return { response: true, message: "New pokemon created", pokemon };
    }

    return { response: false };

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

const createMyPokemonDAO = async (user_id, pokemon) => {
    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            user_id
        },
        UpdateExpression: "SET #t = list_append(#t, :vals)",
        ExpressionAttributeNames: {
            "#t": "my_pokemons"
        },
        ExpressionAttributeValues: {
            ":vals": [
                {
                    "pokemon_id": pokemon.pokemon_id,
                    "pokemon_name": pokemon.pokemon_name,
                    "hp": pokemon.hp,
                    "attack": pokemon.attack,
                    "defense": pokemon.defense,
                    "specialattack": pokemon.specialattack,
                    "specialdefense": pokemon.specialdefense,
                    "speed": pokemon.speed,
                    "type": pokemon.type
                }
            ]
        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes.my_pokemons;
    } catch (error) {
        return null;
    }
}

function validatePokemon(receivedData) {
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