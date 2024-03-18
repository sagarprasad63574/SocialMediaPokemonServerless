const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    UpdateCommand,
    QueryCommand,
    DeleteCommand
} = require('@aws-sdk/lib-dynamodb');
const logger = require('../util/logger');

require('dotenv').config();

const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
const TableName = "SocialMediaPokemon";

const createMyPokemon = async (user_id, pokemon) => {
    const command = new UpdateCommand({
        TableName,
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
                    "types": pokemon.types
                }
            ]
        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes.my_pokemons;
    } catch (error) {
        logger.error(error);
        return null;
    }
}

const ViewMyPokemons = async (user_id, pokemon_name) => {
    const command = new QueryCommand({
        TableName,
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
        logger.error(error);
        return null;
    }
}

const editMyPokemon = async (user_id, pokemon_index, pokemon) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: `SET my_pokemons[${pokemon_index}] = :vals`,
        ExpressionAttributeValues: {

            ":vals": {
                "pokemon_id": pokemon.pokemon_id,
                "pokemon_name": pokemon.pokemon_name,
                "hp": pokemon.hp,
                "attack": pokemon.attack,
                "defense": pokemon.defense,
                "specialattack": pokemon.specialattack,
                "specialdefense": pokemon.specialdefense,
                "speed": pokemon.speed,
                "types": pokemon.types
            }

        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes.my_pokemons[0];
    } catch (error) {
        logger.error(error);
        return null;
    }
}

const deleteMyPokemon = async (user_id, pokemon_index) => {
    const command = new UpdateCommand({
        TableName,
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
        logger.error(error);
        return null;
    }
}

const addPokemonToTeam = async (user_id, team_index, pokemon) => {
    const command = new UpdateCommand({
        TableName,
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
                    "moves":pokemon.moves
                }
            ]

        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes.teams[0].pokemons[0];
    } catch (error) {
        logger.error(error);
        return null;
    }
}

module.exports = {
    createMyPokemon,
    ViewMyPokemons,
    editMyPokemon,
    deleteMyPokemon,
    addPokemonToTeam
}
