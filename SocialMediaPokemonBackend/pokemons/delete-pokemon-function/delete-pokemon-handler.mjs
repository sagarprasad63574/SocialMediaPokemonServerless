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
    const receivedData = JSON.parse(event.body);
    const team_id = parseInt(receivedData.team_id);
    const pokemon_id = parseInt(receivedData.pokemon_id);

    const { response, message, team } = await deletePokemonFromTeam(user_id, team_id, pokemon_id);
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

const deletePokemonFromTeam = async (user_id, team_id, pokemon_id) => {

    const { response } = await viewMyTeams(user_id);
    if (!response) return { response: false, message: "No team found!" }

    let data = await deletePokemonFromTeamDAO(user_id, team_id, pokemon_id);

    if (data) {
        return { response: true, message: "deleted pokemon" };
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

const deletePokemonFromTeamDAO = async (user_id, team_id, pokemon_id) => {
    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
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
        return null;
    }
}