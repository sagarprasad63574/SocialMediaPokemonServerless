const {DynamoDBClient, ScanCommand, QueryCommand} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand} = require("@aws-sdk/lib-dynamodb");
const logger = require('../util/logger');
const client = new DynamoDBClient({region: "us-west-1"});
const documentClient = DynamoDBDocumentClient.from(client);

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
        return data;
    } catch (error) {
        logger.error(error);
    }
}
const getUserByUsername = async username => {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#u = :u",
        ExpressionAttributeNames: {
            "#u" : "username"
        },
        ExpressionAttributeValues: {
            ":u": username
        }
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.error(error);
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
        logger.error(error);
    }
}
const updateUser = async (user_id, newUser) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: "set #u = :u, #p = :p, #e = :e, #t = :t",
        ExpressionAttributeNames: {
            "#u" : "username",
            "#p" : "password",
            "#e" : "email",
            "#t" : "Teams"
        },
        ExpressionAttributeValues: {
            ":u" : newUser.username,
            ":p" : newUser.password,
            ":e" : newUser.email,
            ":t" : newUser.teams
        }
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.error(error);
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