import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
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
    const team_id = event.pathParameters.id;
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