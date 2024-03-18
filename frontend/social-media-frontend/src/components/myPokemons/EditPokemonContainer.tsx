import React, { useState } from 'react'
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Error from '../common/Error';
import Button from 'react-bootstrap/esm/Button';
import { useSelector } from 'react-redux';
import { EditCreatedPokemon } from '../../api/myPokemons/myPokemonsAPI';

const EditPokemonContainer = ({pokemon_index, createdPokemons, setCreatedPokemons, togglePokemon}: any) => {
    const { userToken } = useSelector((state: any) => state.auth)

    const [data, setData] = useState({
        pokemon_name: "",
        attack: "",
        defense: "",
        specialattack: "",
        specialdefense: "",
        speed: "",
        hp: ""
    });

    const [message, setMessage] = useState("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const newPokemon = await EditCreatedPokemon(userToken, pokemon_index, data);
            setMessage(newPokemon.message);
            if (newPokemon.response) {
                setCreatedPokemons([...createdPokemons], 
                            createdPokemons[pokemon_index].pokemon_name = data.pokemon_name,
                            createdPokemons[pokemon_index].attack = data.attack,
                            createdPokemons[pokemon_index].defense = data.defense,
                            createdPokemons[pokemon_index].specialattack = data.specialattack,
                            createdPokemons[pokemon_index].specialdefense = data.specialdefense,
                            createdPokemons[pokemon_index].speed = data.speed,
                            createdPokemons[pokemon_index].hp = data.hp,
                );
                togglePokemon();
            }
        } catch (error: any) {
            console.log("HEllo I am here: ", error);
        }
    }

    return (
        <Container className="d-grid justify-content-center">
            {message && <Error>{message}</Error>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-1" controlId="pokemon_name">
                    <Form.Label>Pokemon Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Pokemon Name" required
                        onChange={(event) => setData({ ...data, pokemon_name: event.target.value })} />
                </Form.Group>
                <Form.Group className="mb-1" controlId="attack">
                    <Form.Label>Attack Power</Form.Label>
                    <Form.Control type="number" placeholder="0" required
                        onChange={(event) => setData({ ...data, attack: event.target.value })} />
                </Form.Group>

                <Form.Group className="mb-1" controlId="defense">
                    <Form.Label>Defense Power</Form.Label>
                    <Form.Control type="number" placeholder="0" required
                        onChange={(event) => setData({ ...data, defense: event.target.value })} />
                </Form.Group>

                <Form.Group className="mb-1" controlId="specialAttack">
                    <Form.Label>Special Attack Power</Form.Label>
                    <Form.Control type="number" placeholder="0" required
                        onChange={(event) => setData({ ...data, specialattack: event.target.value })} />
                </Form.Group>

                <Form.Group className="mb-1" controlId="specialDefense">
                    <Form.Label>Special Defense Power</Form.Label>
                    <Form.Control type="number" placeholder="0" required
                        onChange={(event) => setData({ ...data, specialdefense: event.target.value })} />
                </Form.Group>

                <Form.Group className="mb-1" controlId="speed">
                    <Form.Label>Speed</Form.Label>
                    <Form.Control type="number" placeholder="0" required
                        onChange={(event) => setData({ ...data, speed: event.target.value })} />
                </Form.Group>

                <Form.Group className="mb-1" controlId="hp">
                    <Form.Label>HP</Form.Label>
                    <Form.Control type="number" placeholder="0" required
                        onChange={(event) => setData({ ...data, hp: event.target.value })} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    )
}

export default EditPokemonContainer