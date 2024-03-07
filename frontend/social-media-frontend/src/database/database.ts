import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class SocialMediaPokemonAPI {
    //the token for interactive with the API will be stored here
    static token: any;

    static async request(endpoint: any, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${SocialMediaPokemonAPI.token}` };
        const params = (method === "get")
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err: any) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes

    /** Get token for login from username, password. */

    static async login(data: any) {
        try {
            let res = await axios.put(`${BASE_URL}/users`, data);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    }
}

export default SocialMediaPokemonAPI;