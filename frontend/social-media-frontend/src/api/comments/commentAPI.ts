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

export const getCommentsForTeam = async (userToken: any, team_id: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        };
        const {data} = await axios.get(
            `${BASE_URL}/comments?team_id=${team_id}`,
            config
        );
        console.log("GETTING DATA FROM API", data);
        return data;
    } catch (error: any) {
        console.log(error);
        return error;
    }
};

export const postComment = async (userToken: any, {team_id, comment, rating}: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        };
        const {data} = await axios.post(
            `${BASE_URL}/comments`,
            {team_id, comment, rating},
            config
        );
        console.log("GETTING DATA FROM API", data);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};