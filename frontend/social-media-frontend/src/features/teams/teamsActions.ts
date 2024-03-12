import axios from 'axios'

const BASE_URL = "http://localhost:3001";

const getTeams = async (userToken: any) => {
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
    } catch(error: any) {
        console.log(error);
        return error;
    }
}

export default getTeams;