import axios from 'axios'

const BASE_URL = "http://localhost:3001";

export const BattleSimulate = async (userToken: any, user_team_name: any, opponent_team_name: any, opponent_id: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.post(
            `${BASE_URL}/battleSim`,
            {
                user_team_name,
                opponent_team_name,
                opponent_id
            },
            config
        )

        console.log("GETTING DATA FROM API", data);
        return data;
    } catch (error: any) { //axios status codes from 400-500 300?
        return (error.response.data.error) ? error.response.data.error : error.message;
    }
}