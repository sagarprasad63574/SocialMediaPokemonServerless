import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jsonschema from 'jsonschema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const client = new DynamoDBClient({ region: 'us-west-1' });

const documentClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    if (!event.body) {
        return { statusCode: 400, body: "No Body" };
    }
    const receivedData = JSON.parse(event.body);
    const validated = validateLogin(receivedData);
    if (!validated.response) return {
        statusCode: 400,
        body: JSON.stringify({
            response: false,
            errors: validated.errors,
        }),
    };

    const foundUser = await getUserByUsername(receivedData.username);
    if (!foundUser) return {
        statusCode: 400,
        body: JSON.stringify({
            response: false,
            errors: "User does not exist",
        }),
    };

    if (!(await bcrypt.compare(receivedData.password, foundUser.password))) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                response: false,
                errors: "Incorrect password",
            }),
        };
    };

    const userToken = createToken(foundUser);

    const user = {
        user_id: foundUser.user_id,
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role
    };

    return {
        statusCode: 200,
        body: JSON.stringify({
            response: true,
            message: `User ${foundUser.username} logged in successfully`,
            userToken,
            ...user
        }),
    };
};

function createToken(user) {
    let payload = {
        id: user.user_id,
        username: user.username,
        role: user.role
    }

    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "60m" });
}

const validateLogin = receivedData => {
    const validator = jsonschema.validate(receivedData, userLoginSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack.substring(9));
        return { response: false, errors: errs };
    }
    return { response: true };
};

const getUserByUsername = async (username) => {
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

const userLoginSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/example.json",
    "type": "object",
    "properties": {
        "username": {
            "type": "string",
            "minLength": 5,
            "maxLength": 30
        },
        "password": {
            "type": "string",
            "minLength": 5,
            "maxLength": 20
        }
    },
    "additionalProperties": false,
    "required": [
        "username",
        "password"
    ]
};