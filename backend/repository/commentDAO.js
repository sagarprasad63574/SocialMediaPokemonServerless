const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, ScanCommand, QueryCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand} = require("@aws-sdk/lib-dynamodb");
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
        return null;
    }
};

const getCommentsByUsername = async username => {
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
        ProjectionExpression: "comments"
    });
    try {
        const data = await documentClient.send(command);
        if(!data.Items[0]) return null;
        const comments = data.Items[0].comments;
        return comments;
    } catch (error) {
        logger.error(error);
        return null;
    }
};

const getCommentsByTeam = async team_id => {
    const allComments = await getEveryComment();
    if(!allComments) return null;
    let comments = [];
    for(let i=0; i<allComments.length; i++){
        let currentUser = allComments[i];
        let reducedComments = currentUser.comments.filter(comment => {return comment.team_id === team_id});
        if(!reducedComments || !reducedComments.length) continue;
        let reducedUser = {
            username: currentUser.username,
            comments: reducedComments
        };
        comments.push(reducedUser);
    }
    return comments;
};

const getTeamById = async team_id => {
    const command = new QueryCommand({
        TableName,
        IndexName: "role-index",
        KeyConditionExpression: "#r = :r",
        ExpressionAttributeNames: {
            "#r" : "role"
        },
        ExpressionAttributeValues: {
            ":r" : "user"
        },
        ProjectionExpression: "teams"
    });
    try {
        const data = await documentClient.send(command);
        const objs = data.Items;
        let teamObjs = [];
        for(let i=0; i<objs.length; i++){
            if(!objs[i].teams || !objs[i].teams.length) continue;
            objs[i].teams.forEach(team => {
                teamObjs.push(team);
            });
        }
        let foundTeams = teamObjs.filter(team => {return team.team_id === team_id});
        return foundTeams[0];
    } catch (error) {
        logger.error(error);
        return null;
    }
};

const getCommentsByRole = async role => {
    const command = new QueryCommand({
        TableName,
        IndexName: "role-index",
        KeyConditionExpression: "#r = :r",
        ExpressionAttributeNames: {
            "#r" : "role"
        },
        ExpressionAttributeValues: {
            ":r" : role
        },
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
        return null;
    }
};

const postComment = async (user_id, Comment) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: "set #c = list_append(#c, :val)",
        ExpressionAttributeNames: {
            "#c" : "comments"
        },
        ExpressionAttributeValues: {
            ":val": [
                {
                    team_id : Comment.team_id,
                    comment : Comment.comment,
                    rating : Comment.rating,
                    timestamp : Comment.timestamp
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
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: `set comments[${comment_index}] = :c`,
        ExpressionAttributeValues: {
            ":c": {
                team_id : newComment.team_id,
                comment : newComment.comment,
                rating: newComment.rating,
                timestamp: newComment.timestamp
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
        return data;
    } catch (error) {
        logger.error(error);
        return null;
    }
};

module.exports = {
    getEveryComment,
    getCommentsByUsername,
    getCommentsByTeam,
    getCommentsByRole,
    postComment,
    updateComment,
    deleteComment,
    getTeamById
};