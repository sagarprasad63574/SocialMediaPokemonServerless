const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    UpdateCommand,
    QueryCommand,
    DeleteCommand
} = require('@aws-sdk/lib-dynamodb');
const logger = require('../util/logger');

require('dotenv').config();

const axios = require('axios');

const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
const TableName = "SocialMediaPokemon";

require('dotenv').config();

const pokedata = async (pokiemon) => {
    try
    {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokiemon}/`;
        const pokemon = await axios.get(url);
        return pokemon;
    }
    catch (error) {
        logger.error(error);
        return null;
    }
}

const addPokemonToTeam = async (team_index, user_id, pokemon) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: `SET teams[${team_index}].pokemons = list_append(teams[${team_index}].pokemons, :vals)`,
        ExpressionAttributeValues: {

            ":vals": [
                {
                    "pokemon_name": pokemon.pokemon_name,
                    "hp": pokemon.hp,
                    "attack": pokemon.attack,
                    "defense": pokemon.defense,
                    "specialattack":pokemon.specialattack,
                    "specialdefense":pokemon.specialdefense, 
                    "speed":pokemon.speed, 
                    "type":pokemon.type
                }
            ]

        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes.teams[0].pokemons;
    } catch (error) {
        logger.error(error);
        return null;
    }
}

const deletePokemonFromTeam = async (user_id, team_id, pokemon_id) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: `REMOVE teams[${team_id}].pokemons[${pokemon_id}]`,
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

module.exports = {
    addPokemonToTeam,
    deletePokemonFromTeam,
    pokedata
}
