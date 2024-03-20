import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/esm/Form'
import { useSelector } from 'react-redux'
import { CreatePokemon } from '../../api/myPokemons/myPokemonsAPI'
import Error from '../common/Error';
import ProfileCard from '../profiles/ProfileCard'
import DropdownButton from 'react-bootstrap/esm/DropdownButton'
import Dropdown from 'react-bootstrap/esm/Dropdown'
import { Link } from 'react-router-dom'

const CreatePokemonContainer = () => {
    const { userInfo, userToken } = useSelector((state: any) => state.auth)
    const [message, setMessage] = useState("");

    const [data, setData] = useState(
        {
            "pokemon_name": "",
            "attack": "",
            "defense": "",
            "specialattack": "",
            "specialdefense": "",
            "speed": "",
            "hp": ""
        }
    )

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const createPokemon = await CreatePokemon(userToken, data);
            if (createPokemon.response) {
                setMessage(createPokemon.message);
            } else {
                setMessage("Duplicated pokemon name")
            }

        } catch (error: any) {
            console.log("error: ", error);
        }
    }

    return (
        <div className='d-flex my-3'>
            <DropdownButton id="dropdown-basic-button" title="Navigate">
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                <Dropdown.Item as={Link} to="/viewCreatedPokemons">View Created Pokemons</Dropdown.Item>
                <Dropdown.Item as={Link} to="/teams">View Teams</Dropdown.Item>
                <Dropdown.Item as={Link} to="/comments">View Comments</Dropdown.Item>
            </DropdownButton>
            <Container className="d-grid justify-content-lg-center">
                <h1>CREATE POKEMON</h1>
                {message && <Error>{message}</Error>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="pokemon_image">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="text" placeholder="Enter Image" defaultValue={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png`}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="pokemon_name">
                        <Form.Label>Pokemon Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Pokemon Name" required
                            onChange={(event) => setData({ ...data, pokemon_name: event.target.value })} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="attack">
                        <Form.Label>Attack Power</Form.Label>
                        <Form.Control type="number" placeholder="0" required
                            onChange={(event) => setData({ ...data, attack: event.target.value })} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="defense">
                        <Form.Label>Defense Power</Form.Label>
                        <Form.Control type="number" placeholder="0" required
                            onChange={(event) => setData({ ...data, defense: event.target.value })} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="specialAttack">
                        <Form.Label>Special Attack Power</Form.Label>
                        <Form.Control type="number" placeholder="0" required
                            onChange={(event) => setData({ ...data, specialattack: event.target.value })} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="specialDefense">
                        <Form.Label>Special Defense Power</Form.Label>
                        <Form.Control type="number" placeholder="0" required
                            onChange={(event) => setData({ ...data, specialdefense: event.target.value })} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="speed">
                        <Form.Label>Speed</Form.Label>
                        <Form.Control type="number" placeholder="0" required
                            onChange={(event) => setData({ ...data, speed: event.target.value })} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="hp">
                        <Form.Label>HP</Form.Label>
                        <Form.Control type="number" placeholder="0" required
                            onChange={(event) => setData({ ...data, hp: event.target.value })} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Create
                    </Button>
                </Form>
            </Container>
        </div>
    )
}

export default CreatePokemonContainer