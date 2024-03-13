import axios from 'axios';

const BASE_URL = "http://localhost:3001";

export const getProfile = async (userToken: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.get(
            `${BASE_URL}/profiles`,
            config
        )

        console.log("GETTING DATA FROM API", data);
        return data;
    } catch (error: any) {
        console.log(error);
        return error;
    }
}

export const editProfile = async (userToken: any, { biography, name, email }: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.post(
            `${BASE_URL}/teams`,
            { biography, name, email },
            config
        )

        console.log("GETTING DATA FROM API", data);
        return data;
    } catch (error: any) { //axios status codes from 400-500
        return (error.response.data.error) ? error.response.data.error: error.message;
    }
}