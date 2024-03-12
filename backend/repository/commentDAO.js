import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    ScanCommand,
    QueryCommand,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand
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

const getEveryComment = async () => {
    const command = new ScanCommand({
        TableName,
        ProjectionExpression: "username, comments"
    });
    try {
        const data = await documentClient.send(command);
        const objs = data.Items;
        let commObjs = [];
        for (let i = 0; i < objs.length; i++) {
            if (!objs[i].comments || !objs[i].comments.length) continue;
            commObjs.push(objs[i]);
        }
        return commObjs;
    } catch (error) {
        logger.info(error);
        return null;
    }
};

const getCommentsByUsername = async username => {
    const command = new QueryCommand({
        TableName,
        IndexName: "username-index",
        KeyConditionExpression: "#u = :u",
        ExpressionAttributeNames: {
            "#u": "username"
        },
        ExpressionAttributeValues: {
            ":u": username
        },
        ProjectionExpression: "comments"
    });
    try {
        const data = await documentClient.send(command);
        if (!data.Items[0]) return null;
        const comments = data.Items[0].comments;
        return comments;
    } catch (error) {
        logger.info(error);
        return null;
    }
};

const getCommentsByTeam = async team_name => {
    const allComments = await getEveryComment();
    if (!allComments) return null;
    let comments = [];
    for (let i = 0; i < allComments.length; i++) {
        let currentUser = allComments[i];
        let reducedComments = currentUser.comments.filter(comment => { return comment.team_name === team_name });
        if (!reducedComments || !reducedComments.length) continue;
        let reducedUser = {
            username: currentUser.username,
            comments: reducedComments
        };
        comments.push(reducedUser);
    }
    return comments;
};

const getCommentsByRole = async role => {
    const command = new QueryCommand({
        TableName,
        IndexName: "role-index",
        KeyConditionExpression: "#r = :r",
        ExpressionAttributeNames: {
            "#r": "role"
        },
        ExpressionAttributeValues: {
            ":r": role
        },
        ProjectionExpression: "username, comments"
    });
    try {
        const data = await documentClient.send(command);
        const objs = data.Items;
        let commObjs = [];
        for (let i = 0; i < objs.length; i++) {
            if (!objs[i].comments || !objs[i].comments.length) continue;
            commObjs.push(objs[i]);
        }
        return commObjs;
    } catch (error) {
        logger.info(error);
        return null;
    }
};

const postComment = async (user_id, Comment) => {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id
        },
        UpdateExpression: "set #c = list_append(#c, :vals)",
        ExpressionAttributeNames: {
            "#c": "comments"
        },
        ExpressionAttributeValues: {
            ":vals": [
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
        logger.info(error);
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
                team_name: newComment.team_name,
                comment: newComment.comment
            }
        },
        ReturnValues: "UPDATED_NEW"
    });
    try {
        const data = await documentClient.send(command);
        return data;
    } catch (error) {
        logger.info(error);
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
        logger.info(error);
        return null;
    }
};

export {
    getEveryComment,
    getCommentsByUsername,
    getCommentsByTeam,
    getCommentsByRole,
    postComment,
    updateComment,
    deleteComment
};