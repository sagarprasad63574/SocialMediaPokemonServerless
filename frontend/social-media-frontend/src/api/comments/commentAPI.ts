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
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const updateComment = async (userToken: any, {team_id, comment, rating}: any, comment_index: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        };
        const {data} = await axios.put(
            `${BASE_URL}/comments?comment_index=${comment_index}`,
            {team_id, comment, rating},
            config
        );
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const deleteComment = async (userToken: any, comment_index: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        };
        const {data} = await axios.delete(
            `${BASE_URL}/comments?comment_index=${comment_index}`,
            config
        );
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const getCommentsForAllTeams = async (userToken: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        };
        const {data} = await axios.get(
            `${BASE_URL}/comments?allByTeam=true`,
            config
        );
        return data;
    } catch (error: any) {
        console.log(error);
        return error;
    }
}