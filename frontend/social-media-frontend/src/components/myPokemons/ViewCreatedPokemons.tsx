import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getCreatedPokemons } from '../../api/myPokemons/myPokemonsAPI';
import Accordion from 'react-bootstrap/esm/Accordion';
import ViewPokemon from '../homepage/ViewPokemon';
import Card from 'react-bootstrap/esm/Card';
import { Button } from 'react-bootstrap';
import EditPokemonContainer from './EditPokemonContainer';

const ViewCreatedPokemons = () => {
    const { userToken, userInfo } = useSelector((state: any) => state.auth);
    const [createdPokemons, setCreatedPokemons] = useState([]);
    const [editPokemon, setEditPokemon] = useState(false);

    const togglePokemon = () => {
        setEditPokemon((editPokemon) => !editPokemon)
    }

    useEffect(() => {
        async function createdPokemons() {
            try {
                let pokemons = await getCreatedPokemons(userToken);
                console.log(pokemons);
                setCreatedPokemons(pokemons.pokemons);
            } catch (error) {
                console.log(error);
            }
        }
        createdPokemons();
    }, [userToken]);

    const myPokemons = createdPokemons.map((pokemon: any, index: number) => (
        <Accordion.Item key={pokemon.pokemon_id} eventKey={`${index}`}>
            <Accordion.Header>{pokemon.pokemon_name}</Accordion.Header>
            <Accordion.Body className='d-flex'>
                <Card className="mx-1" style={{ width: '20rem' }}>
                    <Card.Body >
                        <Card.Img variant="left" width="250px" height="250px" src="https://fastly.picsum.photos/id/508/200/200.jpg?hmac=K4JUehX1v2yEPLUOyJDAmRhZu8PgMu4vv6ypO-CA5nw" />
                        <Card.Title >{pokemon.pokemon_name.toUpperCase()}</Card.Title>
                        <Card.Text >
                            Attack: {pokemon.attack}<br />
                            Defense: {pokemon.defense}<br />
                            Special Attack: {pokemon.specialattack}<br />
                            Special Defense: {pokemon.specialdefense}<br />
                            Speed: {pokemon.speed}<br />
                            HP: {pokemon.hp}<br />
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="mx-1" style={{ width: '20rem' }}>
                    <Card.Body >
                        <div>
                            <Button variant='success'>Add To Team</Button>
                            <Button onClick={togglePokemon} className='pull-right mx-2' variant='info'>Edit</Button>
                            <Button variant='danger'>Delete</Button>
                        </div>
                        {editPokemon && <EditPokemonContainer 
                            pokemon_index={index} 
                            createdPokemons={createdPokemons} 
                            setCreatedPokemons={setCreatedPokemons}
                            togglePokemon={togglePokemon}
                            />}
                    </Card.Body>
                </Card>
            </Accordion.Body>
        </Accordion.Item>
    )
    )

    return (
        <div>
            <h1 className="display-3 text-center my-4">View Pokemons</h1>
            <Accordion defaultActiveKey="0">
                {myPokemons}
            </Accordion>
        </div>
    )
}

export default ViewCreatedPokemons