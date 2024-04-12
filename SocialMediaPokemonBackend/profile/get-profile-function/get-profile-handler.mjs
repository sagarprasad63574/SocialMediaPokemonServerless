import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import jwt from 'jsonwebtoken';

const client = new DynamoDBClient({ region: 'us-west-1' });
const documentClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {

    const authenicateUser = authenticateUser(event);
    if (!authenicateUser.response) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                message: authenicateUser.message,
            }),
        };
    }

    const user_id = authenicateUser.user.id;
    const data = await getUser(user_id);
    if (!data.response) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: data.errors,
            }),
        };
    } 

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };

};

const authenticateUser = (event) => {
    try {
        const authHeader = event.headers && event.headers.Authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                return {
                    response: true,
                    user: user,
                }
            } catch {
                return {
                    response: false,
                    message: "Unauthorized",
                }
            }
        } else {
            return {
                response: false,
                message: "Unauthorized",
            }
        }
    } catch (err) {
        return {
            response: false,
            message: err.message,
        }
    }
};

const getUser = async user_id => {
    if(!user_id) return {response: false, errors: "No user id provided"}
    const user = await getUserById(user_id);
    if(!user) return {response: false, errors: `No user found with id ${user_id}`}
    return {response: true, message: `Got user with id ${user_id}`, user};
};

const getUserById = async user_id => {
    const command = new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            user_id
        }
    });
    try {
        const data = await documentClient.send(command);
        return data.Item;
    } catch (error) {
        return null;
    }
}