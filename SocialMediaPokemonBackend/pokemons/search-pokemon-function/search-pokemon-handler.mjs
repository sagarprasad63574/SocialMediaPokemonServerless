import jwt from 'jsonwebtoken';
import axios from 'axios';

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
    const pokemon = event.pathParameters.pokemon;

    const { response, message } = await getPokemon(user_id, pokemon);
    if (response) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                response,
                message,
            }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            response,
            message,
        }),
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

const getPokemon = async (user_id, pokemon_name) => {
    const data = await pokedata(pokemon_name);

    if (data) {
        return { response: true, message: data.data }
    }
    else
    {
        return { response: false, message: "pokemon does not exist" }
    }

}

const pokedata = async (pokiemon) => {
    try
    {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokiemon}/`;
        const pokemon = await axios.get(url);
        return pokemon;
    }
    catch (error) {
        return null;
    }
}