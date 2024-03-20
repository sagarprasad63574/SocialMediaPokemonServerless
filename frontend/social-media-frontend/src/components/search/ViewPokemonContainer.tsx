import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import DropdownButton from 'react-bootstrap/esm/DropdownButton';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { getTeams } from '../../api/teams/teamAPI';
import { useSelector } from 'react-redux';
import Error from '../common/Error'
import ViewMyTeams from './ViewMyTeams';
import Alert from 'react-bootstrap/esm/Alert';

const ViewPokemonContainer = ({ pokemon, setPokemon }: any) => {
    const { userToken } = useSelector((state: any) => state.auth);
    const [messagePokemon, setMessagePokemon] = useState("");
    const [messageTeam, setMessageTeam] = useState("");
    const [response, setResponse] = useState(false);
    const [teams, setTeams] = useState([]);

    const getMyTeams = async () => {
        try {
            let userTeams = await getTeams(userToken);
            setMessageTeam(userTeams.message);
            setTeams(userTeams.teams);
        } catch (error) {
            console.log(error);
        }
    }

    const listStats = pokemon.stats.map((stat: any, index: any) =>
        <Card style={{ width: '18rem' }} key={index}>
            <ListGroup variant="flush">
                <ListGroup.Item>{stat.stat.name}: {stat.base_stat}</ListGroup.Item>
            </ListGroup>
        </Card>
    );

    const listTypes = pokemon.types.map((type: any, index: any) =>
        <Card style={{ width: '18rem' }} key={index}>
            <ListGroup variant="flush">
                <ListGroup.Item>{type.type.name}</ListGroup.Item>
            </ListGroup>
        </Card>
    );

    return (
        <Card style={{ width: '100%', backgroundColor: "lightblue", borderRadius: "25px"}}>
            <Card.Body className='d-flex'>
                <Card.Title className='text-uppercase'>{pokemon.pokemon_name}</Card.Title>
                <Card.Img width="500px" variant="left" src={pokemon.sprites} />
                <Card.Body>
                    <h5>Height: {pokemon.height}</h5>
                    <h5>Weight: {pokemon.weight}</h5>
                    <h5>Base Experience: {pokemon.base_experience}</h5>
                    <h5>Stats: {listStats}</h5>
                    <h5>Types: {listTypes}</h5>
                    {teams ?
                        <DropdownButton onClick={() => getMyTeams()} id="dropdown-basic-button" title="Add To Team">
                            <ViewMyTeams
                                teams={teams}
                                pokemon_name={pokemon.pokemon_name}
                                setMessagePokemon={setMessagePokemon}
                                setResponse={setResponse} />
                        </DropdownButton> :
                        <p>Please add team</p>
                    }
                    {messageTeam &&
                        <Alert variant={response ? "success" : "danger"} className='w-25 p-3 my-3'>
                            {messageTeam && <p>{messagePokemon}</p>}
                        </Alert>
                    }
                </Card.Body>
            </Card.Body>
        </Card>
    )
}

export default ViewPokemonContainer