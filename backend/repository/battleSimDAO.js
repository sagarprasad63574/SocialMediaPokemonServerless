const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, ScanCommand, QueryCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand} = require("@aws-sdk/lib-dynamodb");
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

const addBattleReport = async (team_index, user_id, report) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: `SET teams[${team_index}].battlelog = list_append(teams[${team_index}].battlelog, :vals)`,
        ExpressionAttributeValues: {

            ":vals": [
                {
                    "summary": report.summary,
                    "details": report.details,
                    "won": report.won
                }
            ]

        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes.teams[0].report;
    } catch (error) {
        logger.error(error);
        return null;
    }
}

const addDetails = async (team_index, user_id, team) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: `SET teams[${team_index}] = :vals`,
        ExpressionAttributeValues: {

            ":vals": {
                "team_id": team.team_id,
                "team_name": team.team_name,
                "win": team.win,
                "loss": team.loss,
                "points": team.points,
                "post": team.post, 
                "pokemons": team.pokemons,
                "battlelog": team.battlelog
            }

        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes.teams[0];
    } catch (error) {
        logger.error(error);
        return null;
    }
}

module.exports = {
    addBattleReport,
    addDetails
}