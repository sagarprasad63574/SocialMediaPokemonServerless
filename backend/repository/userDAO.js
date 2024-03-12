import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    ScanCommand,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
    QueryCommand
} from "@aws-sdk/lib-dynamodb";
import logger from '../util/logger.js';
import dotenv from 'dotenv'
dotenv.config();

const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
const TableName = "SocialMediaPokemon";

const getAllUsers = async () => {
    const command = new ScanCommand({
        TableName
    });
    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch (error) {
        logger.info(error);
        return null;
    }
}
const getUserById = async user_id => {
    const command = new GetCommand({
        TableName,
        Key: {
            user_id
        }
    });
    try {
        const data = await documentClient.send(command);
        return data.Item;
    } catch (error) {
        logger.info(error);
        return null;
    }
}
const getUserByUsername = async username => {
    const command = new QueryCommand({
        TableName,
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
        logger.info(error);
        return null;
    }
};

const getUsersByRole = async role => {
    const command = new QueryCommand({
        TableName,
        IndexName: "role-index",
        KeyConditionExpression: "#r = :r",
        ExpressionAttributeNames: {
            "#r": "role"
        },
        ExpressionAttributeValues: {
            ":r": role
        }
    });
    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch (error) {
        logger.info(error);
        return null;
    }
}
const postUser = async User => {
    const command = new PutCommand({
        TableName,
        Item: User
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.info(error);
        return null;
    }
}
const updateUser = async (user_id, newUser) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: "set #u = :u, #p = :p, #n = :n, #e = :e, #b = :b",
        ExpressionAttributeNames: {
            "#u": "username",
            "#p": "password",
            "#n": "name",
            "#e": "email",
            "#b": "biography"
        },
        ExpressionAttributeValues: {
            ":u": newUser.username,
            ":p": newUser.password,
            ":n": newUser.name,
            ":e": newUser.email,
            ":b": newUser.biography
        }
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.info(error);
        return null;
    }
}
const deleteUser = async user_id => {
    const command = new DeleteCommand({
        TableName,
        Key: {
            user_id
        }
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.info(error);
        return null;
    }
}

export {
    getAllUsers,
    getUserById,
    getUserByUsername,
    getUsersByRole,
    postUser,
    updateUser,
    deleteUser
}