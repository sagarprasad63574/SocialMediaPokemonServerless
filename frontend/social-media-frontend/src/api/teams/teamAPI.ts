import axios from 'axios'

const BASE_URL = "http://localhost:3001";

export const getTeams = async (userToken: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.get(
            `${BASE_URL}/teams`,
            config
        )

        console.log("GETTING DATA FROM API", data);
        return data;
    } catch (error: any) {
        console.log(error);
        return error;
    }
}

export const AddTeam = async (userToken: any, { team_name }: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.post(
            `${BASE_URL}/teams`,
            { team_name },
            config
        )
        
        console.log("GETTING DATA FROM API", data);
        return data;
    } catch (error: any) { //axios status codes from 400-500 300?
        return (error.response.data.error) ? error.response.data.error: error.message;
    }
}