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

        console.log("GETTING DATA FROM API", data);
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

        console.log("GETTING DATA FROM API", data);
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
        console.log("GETTING DATA FROM API", data);
        return data;
    } catch (error: any) { //axios status codes from 400-500 300?
        console.log(error)
        return (error.response.data) ? error.response.data : error.message;
    }
}