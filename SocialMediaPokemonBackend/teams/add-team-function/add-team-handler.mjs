import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
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

    const receivedData = JSON.parse(event.body);
    
    const validated = validateTeam(receivedData);
    if (!validated.response) return {
        statusCode: 400,
        body: JSON.stringify({
            response: false, 
            errors: validated.errors,
        }),
    };

    const duplicateTeamName = await checkDuplicatedTeamName(user_id, receivedData.team_name);
    if (duplicateTeamName.response) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                response: false,
                errors: duplicateTeamName.message,
            }),
        };
    }

    const team_id = uuidv4();
    const win = 0;
    const loss = 0;
    const points = 0;
    const post = false; 
    const pokemons = [];
    const battlelog = [];

    let data = await createTeam(
        user_id,
        {
            team_id,
            team_name: receivedData.team_name,
            win,
            loss,
            points,
            post, 
            pokemons,
            battlelog
        });

    if (data) {
        let index = data.length - 1;
        let teams = data[index];
        if (index >= 0) teams.index = index;

        return {
            statusCode: 201,
            body: JSON.stringify({
                response: true,
                message: "New team created", 
                teams: teams
            }),
        };
    }

    return {
        statusCode: 500,
        body: JSON.stringify({
            message: "Internal Server Error"
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

function validateTeam(receivedData) {
    const validator = jsonschema.validate(receivedData, teamAddSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack.substring(9));
        return { response: false, errors: errs }
    }
    return { response: true }
}

async function checkDuplicatedTeamName(user_id, team_name) {
    const { response, teams } = await viewMyTeams(user_id);
    if (!response) return { response: false, message: "No teams found!" };

    const findIndex = findTeamIndex(team_name, teams);

    if (findIndex >= 0) return { response: true, message: "Duplicated team name" }

    return { response: false }
}

function findTeamIndex(team_name, teams) {
    return teams.findIndex((team) => team.team_name === team_name);
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

const createTeam = async (user_id, team) => {
    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
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
                    "post": team.post, 
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
        return null;
    }
}

const teamAddSchema = {
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