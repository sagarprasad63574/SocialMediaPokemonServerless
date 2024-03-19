import axios from 'axios'

const BASE_URL = "http://localhost:3001";

export const SearchPokemon = async (userToken: any, { pokemon_name }: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.get(
            `${BASE_URL}/pokemon/${pokemon_name}`,
            config
        )

        console.log("GETTING DATA FROM API", data);
        return data;
    } catch (error: any) { //axios status codes from 400-500 300?
        return (error.response.data.error) ? error.response.data.error : error.message;
    }
}

export const AddPokemonToTeam = async (userToken: any, pokemon_name: any, team_name: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.post(
            `${BASE_URL}/pokemon`,
            {
                pokemon_name,
                team_name
            },
            config
        )

        console.log("GETTING DATA FROM API", data);
        return data;
    } catch (error: any) { //axios status codes from 400-500 300?
        return (error.response.data) ? error.response.data : error.message;
    }
}

export const AddMoveToPokemon = async (userToken: any, team_index: any, pokemon_index: any, move_name: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }

        const { data } = await axios.post(
            `${BASE_URL}/pokemon/${parseInt(team_index)}/${parseInt(pokemon_index)}`,
            {
                move_name,
            },
            config
        )
        
        console.log(team_index, pokemon_index)
        console.log("GETTING DATA FROM API", data);
        return data;
    } catch (error: any) { //axios status codes from 400-500 300?
        return (error.response.data) ? error.response.data : error.message;
    }
}