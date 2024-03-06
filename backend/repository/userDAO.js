const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand} = require("@aws-sdk/lib-dynamodb");
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
    const users = await getAllUsers();
    return users.filter(user => {return user.username === username})[0];
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
        UpdateExpression: "set #u = :u, #p = :p, #e = :e, #b = :b",
        ExpressionAttributeNames: {
            "#u" : "username",
            "#p" : "password",
            "#e" : "email",
            "#b" : "biography"
        },
        ExpressionAttributeValues: {
            ":u" : newUser.username,
            ":p" : newUser.password,
            ":e" : newUser.email,
            ":b" : newUser.biography
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