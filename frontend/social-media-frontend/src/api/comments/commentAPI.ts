import axios from 'axios';

const BASE_URL = "http://localhost:3001";

export const getCommentsFromUser = async (userToken: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        };
        const {data} = await axios.get(
            `${BASE_URL}/comments`,
            config
        );
        console.log("GETTING DATA FROM API", data);
        return data;
    } catch (error: any) {
        console.log(error);
        return error;
    }
};

export const convertTimestampToUTC = (timestamp: string) => {
    const timeDate = new Date(timestamp);
    return timeDate.toUTCString();

};