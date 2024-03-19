import React from 'react'
import Card from 'react-bootstrap/esm/Card'
import Col from 'react-bootstrap/esm/Col'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Stack from 'react-bootstrap/esm/Stack'

function ViewPokemon({ pokemons }: any) {
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

    const userPokemons = pokemons.map((pokemon: any, index: number) => (
        <Card className="mx-1" key={index}>
            <Card.Body >
                {pokemon.sprite && <Card.Img variant="top" width="200px" height="200px" src={pokemon.sprite} />}
                <Card.Title >{pokemon.pokemon_name.toUpperCase()}</Card.Title>
                <Card.Text >
                    Defense: {pokemon.defense}<br />
                    Attack: {pokemon.attack}<br />
                    HP: {pokemon.hp}<br />
                    Special Attack: {pokemon.specialattack}<br />
                    Special Defense: {pokemon.specialdefense}<br />
                    Speed: {pokemon.speed}<br />
                    Types: {pokemon.type.length > 0 ? <strong>{getTypesString(pokemon.type)}</strong> : [] } <br />
                    Moves: {pokemon.moves.length > 0 ? <strong>{getMovesString(pokemon.moves)}</strong> : <span>No moves added</span> }

                </Card.Text>
            </Card.Body>
        </Card>
    ))

    return (
        <div className="d-flex bd-highlight">{userPokemons}</div>
    )
}
export default ViewPokemon