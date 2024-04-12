import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jsonschema from 'jsonschema';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const client = new DynamoDBClient({ region: 'us-west-1' });

const documentClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                errors: "No Body",
            }),
        };
    }
    const receivedData = JSON.parse(event.body);
    const validated = validateRegister(receivedData);
    if (!validated.response) return {
        statusCode: 400,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            response: false,
            errors: validated.errors,
        }),
    };

    const foundUser = await getUserByUsername(receivedData.username);
    if (foundUser) return {
        statusCode: 400,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            response: false,
            errors: `User already exists with username ${receivedData.username}`,
        }),
    };

    const user_id = uuidv4();
    const teams = [];
    const my_pokemons = [];
    const comments = [];
    const biography = "";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(receivedData.password, salt);

    const newUser = {
        user_id,
        username: receivedData.username,
        password: hashedPassword,
        name: receivedData.name,
        email: receivedData.email,
        role: receivedData.role ? receivedData.role : "user",
        teams,
        my_pokemons,
        biography,
        comments
    };

    try {
        let data = await postUser(newUser);
        if (!data) return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                response: false,
                errors: "Could not create user",
            }),
        };

        return {
            statusCode: 201,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                response: true,
                message: `Successfully created user ${receivedData.username}`,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: error,
            }),
        };
    }
};

const validateRegister = receivedData => {
    const validator = jsonschema.validate(receivedData, userRegisterSchema);
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


const postUser = async (user) => {
    const command = new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: user
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        return null;
    }
};

const userRegisterSchema = {
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
        },
        "role": {
            "role": "string"
        }
    },
    "additionalProperties": false,
    "required": [
        "username",
        "password",
        "name",
        "email"
    ]
};