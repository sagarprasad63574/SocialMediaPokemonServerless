import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jwt from 'jsonwebtoken';

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

    const { response, message, pokemon } = await deleteMyPokemon(user_id, pokemon_id);

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

const deleteMyPokemon = async (user_id, pokemon_index) => {
    const getMyPokemon = await viewMyPokemonsById(user_id, pokemon_index);
    if (!getMyPokemon.response) return { response: getMyPokemon.response, message: getMyPokemon.message };

    let data = await deleteMyPokemonDAO(
        user_id,
        pokemon_index
    );

    if (data) {
        return {
            response: true,
            message: `Deleted pokemon with pokemon id: ${pokemon_index}, pokemon name: ${getMyPokemon.pokemon.pokemon_name}`
        };
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

const deleteMyPokemonDAO = async (user_id, pokemon_index) => {
    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            user_id
        },
        UpdateExpression: `REMOVE my_pokemons[${pokemon_index}]`,
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        return null;
    }
}