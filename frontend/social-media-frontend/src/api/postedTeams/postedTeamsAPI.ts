import axios from 'axios'

const BASE_URL = "http://localhost:3001";

export const getAllPostedTeams = async (userToken: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.get(
            `${BASE_URL}/posts`,
            config
        )

        return data;
    } catch (error: any) {
        console.log(error);
        return error;
    }
}

export const getPostedTeamWithId = async (userToken: any, team_id: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.get(
            `${BASE_URL}/posts/${team_id}`,
            config
        )

        return data;
    } catch (error: any) {
        console.log(error);
        return error;
    }
}

export const postTeamWithId = async (userToken: any, team_index: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.post(
            `${BASE_URL}/posts/${team_index}`,
            {},
            config
        )

        return data;
    } catch (error: any) {
        console.log(error);
        return error;
    }
}
