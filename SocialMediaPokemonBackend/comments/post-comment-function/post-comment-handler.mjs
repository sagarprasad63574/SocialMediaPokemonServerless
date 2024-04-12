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

    const username = authenicateUser.user.username;
    const receivedData = JSON.parse(event.body);

    const data = await postComment({ username, ...receivedData });
    if (!data.response) {
        return {
            statusCode: 400,
            body: JSON.stringify(data.errors),
        };
    }

    return {
        statusCode: 201,
        body: JSON.stringify(data),
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

const postComment = async receivedData => {
    const validated = validateCommentPost(receivedData);
    if (!validated.response) return { response: false, errors: validated.errors };

    const foundUser = await getUserByUsername(receivedData.username);
    if (!foundUser) return { response: false, errors: "User not found" };

    const foundTeam = await getTeamById(receivedData.team_id);
    if (!foundTeam) return { response: false, errors: "Team does not exist" };
    if (!foundTeam.post) return { response: false, errors: "Team has not been posted yet" };

    const newComment = {
        team_id: receivedData.team_id,
        comment: receivedData.comment,
        rating: receivedData.rating,
        timestamp: new Date().toISOString()
    };

    const data = await postCommentDAO(foundUser.user_id, newComment);
    if (!data) return { response: false, errors: "Could not create comment" };

    return { response: true, message: "Successfully created comment" };
};

const postCommentDAO = async (user_id, Comment) => {
    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            user_id
        },
        UpdateExpression: "set #c = list_append(#c, :val)",
        ExpressionAttributeNames: {
            "#c" : "comments"
        },
        ExpressionAttributeValues: {
            ":val": [
                {
                    team_id : Comment.team_id,
                    comment : Comment.comment,
                    rating : Comment.rating,
                    timestamp : Comment.timestamp
                }
            ]
        },
        ReturnValues: "UPDATED_NEW"
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        return null;
    }
};

const getTeamById = async team_id => {
    const command = new QueryCommand({
        TableName: process.env.TABLE_NAME,
        IndexName: "role-index",
        KeyConditionExpression: "#r = :r",
        ExpressionAttributeNames: {
            "#r": "role"
        },
        ExpressionAttributeValues: {
            ":r": "user"
        },
        ProjectionExpression: "teams"
    });
    try {
        const data = await documentClient.send(command);
        const objs = data.Items;
        let teamObjs = [];
        for (let i = 0; i < objs.length; i++) {
            if (!objs[i].teams || !objs[i].teams.length) continue;
            objs[i].teams.forEach(team => {
                teamObjs.push(team);
            });
        }
        let foundTeams = teamObjs.filter(team => { return team.team_id === team_id });
        return foundTeams[0];
    } catch (error) {
        return null;
    }
};


const getUserByUsername = async username => {
    const command = new QueryCommand({
        TableName: process.env.TABLE_NAME,
        IndexName: "username-index",
        KeyConditionExpression: "#u = :u",
        ExpressionAttributeNames: {
            "#u": "username"
        },
        ExpressionAttributeValues: {
            ":u": username
        }
    });
    try {
        const data = await documentClient.send(command);
        return data.Items[0];
    } catch (error) {
        return null;
    }
};

const validateCommentPost = receivedData => {
    const validator = jsonschema.validate(receivedData, commentPostSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack.substring(9));
        return { response: false, errors: errs };
    }
    return { response: true };
};

const commentPostSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/example.json",
    "type": "object",
    "properties": {
        "username": {
            "type": "string",
            "minLength": 5,
            "maxLength": 30
        },
        "team_id": {
            "type": "string",
            "minLength": 5,
            "maxLength": 40
        },
        "comment": {
            "type": "string",
            "minLength": 1,
            "maxLength": 140
        },
        "rating": {
            "type": "number"
        }
    },
    "required": [
        "username",
        "team_id",
        "comment",
        "rating"
    ]
};