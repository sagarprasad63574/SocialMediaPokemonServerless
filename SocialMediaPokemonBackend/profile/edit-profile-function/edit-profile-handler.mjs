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

    const data = await editProfile({username, ...receivedData});
    if (!data.response) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: data.errors,
            }),
        };
    } 

    return {
        statusCode: 200,
        body: JSON.stringify(data)
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

const editProfile = async receivedData => {
    const validated = validateProfile(receivedData);
    if(!validated.response) return {response: false, errors: validated.errors};

    const foundUser = await getUserByUsername(receivedData.username);
    if(!foundUser) return {response: false, errors: "User does not exist"};

    foundUser.biography = receivedData.biography;
    foundUser.name = receivedData.name;
    foundUser.email = receivedData.email;

    const data = await updateUser(foundUser.user_id, foundUser);
    if(!data) return {response: false, errors: "Could not update user profile"};

    return {response: true, message: `User ${receivedData.username} profile updated successfully`};
}

const getUserByUsername = async username => {
    const command = new QueryCommand({
        TableName: process.env.TABLE_NAME,
        IndexName: "username-index",
        KeyConditionExpression: "#u = :u",
        ExpressionAttributeNames: {
            "#u" : "username"
        },
        ExpressionAttributeValues: {
            ":u" : username
        }
    });
    try {
        const data = await documentClient.send(command);
        return data.Items[0];
    } catch (error) {
        return null;
    }
};

const updateUser = async (user_id, newUser) => {
    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            user_id
        },
        UpdateExpression: "set #u = :u, #p = :p, #n = :n, #e = :e, #b = :b",
        ExpressionAttributeNames: {
            "#u" : "username",
            "#p" : "password",
            "#n" : "name",
            "#e" : "email",
            "#b" : "biography"
        },
        ExpressionAttributeValues: {
            ":u" : newUser.username,
            ":p" : newUser.password,
            ":n" : newUser.name,
            ":e" : newUser.email,
            ":b" : newUser.biography
        }
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        return null;
    }
}

const validateProfile = receivedData => {
    const validator = jsonschema.validate(receivedData, userProfileSchema);
    if(!validator.valid){
        const errs = validator.errors.map(e => e.stack.substring(9));
        return {response: false, errors: errs};
    }
    return {response: true};
}

const userProfileSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/example.json",
    "type": "object",
    "properties": {
        "username": {
            "type": "string",
            "minLength": 5,
            "maxLength": 30
        },
        "biography": {
            "type": "string",
            "minLength": 1
        },
        "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 30
        },
        "email": {
            "type": "string",
            "minLength": 5,
            "maxLength": 30,
            "format": "email"
        }
    },
    "additionalProperties": false,
    "required": [
        "username",
        "biography",
        "name",
        "email"
    ]
}