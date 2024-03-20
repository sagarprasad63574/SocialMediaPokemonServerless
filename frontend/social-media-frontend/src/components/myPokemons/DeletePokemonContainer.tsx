import React, { useState } from 'react'
import Alert from 'react-bootstrap/esm/Alert';
import Button from 'react-bootstrap/esm/Button';
import { useSelector } from 'react-redux';
import { DeleteCreatedPokemon } from '../../api/myPokemons/myPokemonsAPI';

const DeletePokemonContainer = ({ pokemon, pokemon_index, createdPokemons, setCreatedPokemons, show, setShow }: any) => {
    const { userToken } = useSelector((state: any) => state.auth)

    const [data, setData] = useState({
        team_name: "",
    });

    const [message, setMessage] = useState("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const deletedPokemon = await DeleteCreatedPokemon(userToken, pokemon_index);
            setMessage(deletedPokemon.message);
            if (deletedPokemon.response) {
                const removedPokemonFromMyPokemons = createdPokemons.filter((pokemon: any, index: any) => index != pokemon_index);
                setCreatedPokemons(removedPokemonFromMyPokemons)
                setShow(false)
            }
        } catch (error: any) {
            console.log("error: ", error);
        }
    }
    return (
        <Alert className='my-3' variant="danger" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>DELETE POKEMON: {pokemon.pokemon_name}</Alert.Heading>
            <Button className="float-right" variant="danger" onClick={handleSubmit}>Yes</Button>
        </Alert>
    );
}

export default DeletePokemonContainer