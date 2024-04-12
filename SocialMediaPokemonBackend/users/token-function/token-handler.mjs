import jwt from 'jsonwebtoken';

export const handler = async (event) => {
    try {
        const authHeader = event.headers && event.headers.Authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY);
                return {
                    statusCode: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify(user),
                }
            } catch {
                return {
                    statusCode: 401,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({ message: "Unauthorized" }),
                }
            }
        } else {
            return {
                statusCode: 401,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "Unauthorized" }),
            }
        }
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: err.message }),
        }
    }
};


