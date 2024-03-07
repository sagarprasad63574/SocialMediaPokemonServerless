const {DynamoDBClient, QueryCommand} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand} = require("@aws-sdk/lib-dynamodb");
const logger = require('../util/logger');
require('dotenv').config;

const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
const TableName = "SocialMediaPokemon";

const getEveryComment = async () => {
    const command = new ScanCommand({
        TableName,
        ProjectionExpression: "comments"
    });
    try {
        const data = await documentClient.send(command);
        console.log(data);
        return data;
    } catch (error) {
        logger.error(error);
    }
};

const getCommentByUsername = async username => {
    const command = new QueryCommand({
        TableName,
        IndexName: "username-index",
        KeyConditionExpression: "#u = :u",
        ExpressionAttributeNames: {
            "#u" : "username"
        },
        ExpressionAttributeValues: {
            ":u" : username
        },
        "ProjectionExpression": "comments"
    });
    try {
        const data = await documentClient.send(command);
        console.log(data);
        return data;
    } catch (error) {
        logger.error(error);
        return null;
    }
};

const getCommentByTeam = async team_name => {
    const comments = await getEveryComment();
    if(!comments) return null;
    const teamComments = comments.filter(comment => {return comment.team_name === team_name});
    return teamComments;
};

const postComment = async (user_id, Comment) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: "set #c = list_append(#c, :vals)",
        ExpressionAttributeNames: {
            "#c" : "comments"
        },
        ExpressionAttributeValues: {
            ":vals" : [
                {
                    "team_name": Comment.team_name,
                    "comment": Comment.comment
                }
            ]
        },
        ReturnValues: "UPDATED_NEW"
    });
    try {
        const data = await documentClient.send(command);
        console.log(data);
        return data;
    } catch (error) {
        logger.error(error);
        return null;
    }
};

const updateComment = async (user_id, comment_index, newComment) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: `set comments[${comment_index}] = list_append(comments[${comment_index}], :vals)`,
        ExpressionAttributeValues: {
            ":vals" : [
                {
                    "team_name" : newComment.team_name,
                    "comment" : newComment.comment
                }
            ]
        },
        ReturnValues: "UPDATED_NEW"
    });
    try {
        const data = await documentClient.send(command);
        console.log(data);
        return data;
    } catch (error) {
        logger.error(error);
        return null;
    }
};

const deleteComment = async (user_id, comment_index) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: `remove comments[${comment_index}]`
    });
    try {
        const data = await documentClient.send(command);
        console.log(data);
        return data;
    } catch (error) {
        logger.error(error);
        return null;
    }
};

module.exports = {
    getEveryComment,
    getCommentByUsername,
    getCommentByTeam,
    postComment,
    updateComment,
    deleteComment
};