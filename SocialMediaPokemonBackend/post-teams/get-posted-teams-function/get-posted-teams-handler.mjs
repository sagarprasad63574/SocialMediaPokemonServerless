import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
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

    const { response, message, teams } = await viewAllPostedTeams();
    if (response) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                response,
                message,
                teams,
            }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message,
        }),
    };
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

const viewAllPostedTeams = async () => {
    const users = await ViewAllUsersTeams();
    const teams = users.map((user, index) => {
        const postedTeams = user.teams.filter((team, index) => team.post === true);
        if (postedTeams.length > 0) return { user_id: user.user_id, name: user.name, username: user.username, teams: postedTeams }

    }).filter((team, index) => team);

    return { response: true, message: "Posted Teams", teams };
}

const ViewAllUsersTeams = async (role = 'user') => {
    const command = new QueryCommand({
        TableName: process.env.TABLE_NAME,
        IndexName: "role-index",
        KeyConditionExpression: "#r = :r",
        ExpressionAttributeNames: { "#r": "role" },
        ExpressionAttributeValues: { ":r": role }
    });

    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch (error) {
        return null;
    }
}