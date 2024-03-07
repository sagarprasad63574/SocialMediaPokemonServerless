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

const getCommentByUser = async user_id => {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "user_id = :id",
        ExpressionAttributeValues: {
            ":id": user_id
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
    const teamComments = comments.filter(comment => {return comment.team_name === team_name});
    return teamComments;
};

const postComment = async (user_id, Comment) => {

};

const updateComment = async (user_id, newComment) => {

};

const deleteComment = async (user_id, comment_index) => {

};

module.exports = {
    getEveryComment,
    getCommentByUser,
    getCommentByTeam,
    postComment,
    updateComment,
    deleteComment
};