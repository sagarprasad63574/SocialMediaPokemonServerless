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
    const team_id = event.pathParameters.id;

    const receivedData = JSON.parse(event.body);

    let { response, errors } = validateEditTeam(receivedData);
    if (!response) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                response: false,
                errors: errors,
            }),
        };
    }

    const getTeam = await viewTeamById(user_id, team_id);
    if (!getTeam.response) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                response: getTeam.response,
                message: getTeam.message,
            }),
        };
    }
    const duplicateTeamName = await checkDuplicatedTeamName(user_id, receivedData.team_name);
    if (duplicateTeamName.response) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                response: false,
                message: duplicateTeamName.message,
            }),
        };
    }

    let data = await editTeam(
        user_id,
        team_id,
        {
            team_name: receivedData.team_name,
        });

    if (data) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                response: true,
                message: `Team edited!,  Name: ${data.team_name}`,
            }),
        };
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            response: false,
            message: "Team not edited!",
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

function validateEditTeam(receivedData) {
    const validator = jsonschema.validate(receivedData, teamEditSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack.substring(9));
        return { response: false, errors: errs }
    }
    return { response: true }
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
    let teams = await ViewUsersTeams(user_id);
    if (teams.length == 0) {
        return { response: false, message: "No teams found!" };
    }
    return { response: true, message: "My teams", teams };
}

async function checkDuplicatedTeamName(user_id, team_name) {
    const { response, teams } = await viewMyTeams(user_id);
    if (!response) return { response: false, message: "No teams found!" };

    const findIndex = findTeamIndexToAddPokemon(team_name, teams);

    if (findIndex >= 0) return { response: true, message: "Duplicated team name" }

    return { response: false }
}

function findTeamIndexToAddPokemon(team_name, teams) {
    return teams.findIndex((team) => team.team_name === team_name);
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

const editTeam = async (user_id, team_index, team) => {
    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
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
        return null;
    }
}

const teamEditSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/example.json",
    "type": "object",
    "properties": {
        "team_name": {
            "type": "string",
            "minLength": 5,
            "maxLength": 30
        }
    },
    "additionalProperties": false,
    "required": [
        "team_name"
    ]
}