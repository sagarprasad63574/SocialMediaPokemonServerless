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
    const team_id = event.pathParameters.id;

    const { response, message, team } = await postTeam(user_id, team_id);

    if (response) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                response,
                message,
                team,
            }),
        };
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            response,
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

const postTeam = async (user_id, team_id) => {
    const { response, message, team } = await viewTeamById(user_id, team_id);
    if (!response) return { response, message };

    if (team.post === true) return { response: false, message: "Team already posted!", team }

    const postedTeam = await postTeamToHomePage(user_id, team_id);

    return { response: true, message: "Team posted!" }
}

const viewTeamById = async (user_id, team_id) => {
    const { response, message, teams } = await viewMyTeams(user_id);
    if (!response) return { response, message }

    const team = teams[team_id];

    if (response && team) {
        return { response, team }
    }

    return { response: false, message: `No team found with id ${team_id}` }

}

const viewMyTeams = async (user_id) => {

    const teams = await ViewUsersTeams(user_id);
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

const postTeamToHomePage = async (user_id, team_index) => {
    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            user_id
        },
        UpdateExpression: `SET teams[${team_index}].post = :vals`,
        ExpressionAttributeValues: {
            ":vals": true,
        },
        ReturnValues: "UPDATED_NEW"
    });

    try {
        const data = await documentClient.send(command);
        console.log(data.Attributes.teams);
    } catch (error) {
        return null;
    }
}
