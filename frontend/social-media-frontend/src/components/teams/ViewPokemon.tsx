import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import Col from 'react-bootstrap/esm/Col'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Stack from 'react-bootstrap/esm/Stack'
import AddMovesView from './AddMovesView'
import { DeletePokemonFromTeam } from '../../api/pokemon/pokemonAPI'
import { useSelector } from 'react-redux'

const ViewPokemon = ({ pokemons, team_index, pokemonIndex, setPokemonIndex, userTeams, setTeams }: any) => {
    const [addMoves, setAddMoves] = useState(false);
    const { userToken } = useSelector((state: any) => state.auth)

    const toggleEditMove = (event: any) => {
        setPokemonIndex(event.target.value)
        setAddMoves((addMoves) => !addMoves)
    }


    const getTypesString = (typeArr: any[]) => {
        let tString = `[${typeArr[0].type.name}`;
        for (let i = 1; i < typeArr.length; i++) {
            tString += `, ${typeArr[i].type.name}`;
        }
        tString += `]`;
        return tString;
    }

    const getMovesString = (movesArr: any[]) => {
        let tString = `[${movesArr[0].move_name}`;
        for (let i = 1; i < movesArr.length; i++) {
            tString += `, ${movesArr[i].move_name}`;
        }
        tString += `]`;
        return tString;
    }

    const handleDelete = async (event: any) => {
        event.preventDefault();
        console.log("What is this team index: ", team_index)
        try {
            const deletePokemon = await DeletePokemonFromTeam(userToken, team_index, event.target.value);
            console.log(deletePokemon)
            if (deletePokemon.response) {
                setTeams([...userTeams], userTeams[team_index].pokemons.splice(event.target.value, 1))
            }
        } catch (error: any) {
            console.log("HEllo I am here: ", error);
        }
    }

    const userPokemons = pokemons.map((pokemon: any, index: number) => (
        <Card className="mx-1" key={pokemon.pokemon_id}>
            <Card.Body>
                <Button onClick={handleDelete} className='float-right bg-danger' value={index}>Delete</Button>

                <Card.Img variant="top" width="200px" height="200px" src={pokemon.sprite} />
                <Card.Title >{pokemon.pokemon_name.toUpperCase()}</Card.Title>
                <Card.Text style={{ width: "200px" }}>
                    Defense: {pokemon.defense}<br />
                    Attack: {pokemon.attack}<br />
                    HP: {pokemon.hp}<br />
                    Special Attack: {pokemon.specialattack}<br />
                    Special Defense: {pokemon.specialdefense}<br />
                    Speed: {pokemon.speed}<br />
                    Types: {pokemon.type.length > 0 ? <strong>{getTypesString(pokemon.type)}</strong> : []} <br />
                    Moves: {pokemon.moves.length > 0 ? <strong>{getMovesString(pokemon.moves)}</strong> : <span>No moves added</span>}
                    <Button onClick={toggleEditMove} className='d-block my-2' value={index}>Add Move</Button>
                </Card.Text>
            </Card.Body>
        </Card>
    ))

    return (
        <div className='d-block'>
            <div className="d-flex bd-highlight">{userPokemons}</div>
            {addMoves && <AddMovesView
                team_index={team_index}
                pokemon_index={pokemonIndex}
                toggleEditMove={setAddMoves}
                userTeams={userTeams}
                setTeams={setTeams}
            />}
        </div>

    )
}
export default ViewPokemon