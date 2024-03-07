const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand} = require("@aws-sdk/lib-dynamodb");
const logger = require('../util/logger');
require('dotenv').config();

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
        logger.error(error);
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
        logger.error(error);
        return null;
    }
}
const getUserByUsername = async username => {
    const command = new QueryCommand({
        TableName,
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
        logger.error(error);
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
        console.log("Hello", data);
        return data;
    } catch (error) {
        logger.error(error);
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
        logger.error(error);
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
        logger.error(error);
        return null;
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    postUser,
    updateUser,
    deleteUser
}