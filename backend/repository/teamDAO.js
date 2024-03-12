import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    UpdateCommand,
    QueryCommand,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import logger from '../util/logger.js';
import dotenv from 'dotenv'
dotenv.config();

const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
const TableName = "SocialMediaPokemon";

import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();

const addPokemon = async (pokiemon) => {
    try {
       /* {
            height: 17,
            id: 6,
            name: 'charizard',
            },
            stats: [
              { base_stat: 78, effort: 0, stat: [Object] },
              { base_stat: 84, effort: 0, stat: [Object] },
              { base_stat: 78, effort: 0, stat: [Object] },
              { base_stat: 109, effort: 3, stat: [Object] },
              { base_stat: 85, effort: 0, stat: [Object] },
              { base_stat: 100, effort: 0, stat: [Object] }
            ],
            types: [ { slot: 1, type: [Object] }, { slot: 2, type: [Object] } ],
            weight: 905
          }
        */
        const pokemon = await P.getPokemonByName(pokiemon);
        //console.log(pokemon);
        const poke = {
            id: pokemon.id,
            pokemon_name: pokemon.name,
            hp:pokemon.stats[0].base_stat, 
            attack:pokemon.stats[1].base_stat, 
            defense:pokemon.stats[2].base_stat, 
            specialattack:pokemon.stats[3].base_stat,
            specialdefense:pokemon.stats[4].base_stat, 
            speed:pokemon.stats[5].base_stat, 
            type:pokemon.types
        };
        return poke;
    } catch (error) {
        logger.info(error);
        return null;
    }
}

const createTeam = async (user_id, team) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: "SET #t = list_append(#t, :vals)",
        ExpressionAttributeNames: {
            "#t": "teams"
        },
        ExpressionAttributeValues: {
            ":vals": [
                {
                    "team_id": team.team_id,
                    "team_name": team.team_name,
                    "win": team.win,
                    "loss": team.loss,
                    "points": team.points,
                    "pokemons": team.pokemons,
                    "battlelog": team.battlelog
                }
            ]
        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes.teams;
    } catch (error) {
        logger.info(error);
        return null;
    }
}

const editTeam = async (user_id, team_index, team) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: `SET teams[${team_index}].team_name = :vals`,
        ExpressionAttributeValues: {

            ":vals": team.team_name,

        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes.teams[0];
    } catch (error) {
        logger.info(error);
        return null;
    }
}


const deleteTeam = async (user_id, team_index) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: `REMOVE teams[${team_index}]`,
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.info(error);
        return null;
    }
}


const ViewUsersTeams = async (user_id) => {
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
        return data.Items[0].teams;
    } catch (error) {
        logger.info(error);
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
        logger.info(error);
        return null;
    }
}

export {
    createTeam,
    editTeam,
    deleteTeam,
    ViewUsersTeams,
    addPokemonToTeam,
    addPokemon
}
