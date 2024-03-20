import axios from 'axios'

const BASE_URL = "http://localhost:3001";

export const CreatePokemon = async (userToken: any, receviedData: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.post(
            `${BASE_URL}/myPokemon`,
            {
                "pokemon_name": receviedData.pokemon_name,
                "attack": parseInt(receviedData.attack),
                "defense": parseInt(receviedData.defense),
                "specialattack": parseInt(receviedData.specialattack),
                "specialdefense": parseInt(receviedData.specialdefense),
                "speed": parseInt(receviedData.speed),
                "hp": parseInt(receviedData.hp)
            },
            config
        )
        return data;
    } catch (error: any) { //axios status codes from 400-500 300?
        return (error.response.data.error) ? error.response.data.error : error.message;
    }
}

export const getCreatedPokemons = async (userToken: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.get(
            `${BASE_URL}/myPokemon`,
            config
        )
        return data;
    } catch (error: any) { //axios status codes from 400-500 300?
        return (error.response.data.error) ? error.response.data.error : error.message;
    }
}

export const AddCreatedPokemonToTeam = async (userToken: any, pokemon_index: any, team_name: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.post(
            `${BASE_URL}/myPokemon/add/${pokemon_index}`,
            {team_name}, 
            config
        )
        return data;
    } catch (error: any) { //axios status codes from 400-500 300?
        return (error.response.data.error) ? error.response.data.error : error.message;
    }
}

export const EditCreatedPokemon = async (userToken: any, pokemon_index: any, receviedData: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.put(
            `${BASE_URL}/myPokemon/${pokemon_index}`,
            {
                "pokemon_name": receviedData.pokemon_name,
                "attack": parseInt(receviedData.attack),
                "defense": parseInt(receviedData.defense),
                "specialattack": parseInt(receviedData.specialattack),
                "specialdefense": parseInt(receviedData.specialdefense),
                "speed": parseInt(receviedData.speed),
                "hp": parseInt(receviedData.hp)
            },
            config
        )
        return data;
    } catch (error: any) { //axios status codes from 400-500 300?
        console.log(error)
        return (error.response.data) ? error.response.data : error.message;
    }
}

export const DeleteCreatedPokemon = async (userToken: any, pokemon_index: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.delete(
            `${BASE_URL}/myPokemon/${pokemon_index}`,
            config
        )
        return data;
    } catch (error: any) { //axios status codes from 400-500 300?
        console.log(error)
        return (error.response.data) ? error.response.data : error.message;
    }
}