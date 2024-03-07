const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, ScanCommand, QueryCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand} = require("@aws-sdk/lib-dynamodb");
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
        ProjectionExpression: "username, comments"
    });
    try {
        const data = await documentClient.send(command);
        const objs = data.Items;
        let commObjs = [];
        for(let i=0; i<objs.length; i++){
            if(!objs[i].comments || !objs[i].comments.length) continue;
            commObjs.push(objs[i]);
        }
        return commObjs;
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
        const comments = data.Items[0].comments;
        return comments;
    } catch (error) {
        logger.error(error);
        return null;
    }
};

const getCommentByTeam = async team_name => {
    const allComments = await getEveryComment();
    if(!allComments) return null;
    let comments = [];
    for(let i=0; i<allComments.length; i++){
        let currentUser = allComments[i];
        let reducedComments = currentUser.comments.filter(comment => {return comment.team_name === team_name});
        let reducedUser = {
            username: currentUser.username,
            comments: reducedComments
        };
        comments.push(reducedUser);
    }
    return comments;
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
        return data;
    } catch (error) {
        logger.error(error);
        return null;
    }
};

const updateComment = async (user_id, comment_index, newComment) => {
    console.log(user_id);
    console.log(comment_index);
    console.log(newComment);
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: `set comments[${comment_index}] = :c`,
        ExpressionAttributeValues: {
            ":c": {
                team_name : newComment.team_name,
                comment : newComment.comment
            }
        },
        ReturnValues: "UPDATED_NEW"
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.error(error);
        return null;
    }
};

const deleteComment = async (user_id, comment_index) => {
    console.log(user_id);
    console.log(comment_index);
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