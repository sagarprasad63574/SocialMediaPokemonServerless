import React from 'react'
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';

const ViewPokemon = ({ teams, user }: any) => {
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

    const opponentPokemons = teams.pokemons.map((pokemon: any, index: number) => (
        <Card className="mx-1" key={pokemon.pokemon_id}>
            <Card.Body>
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
                    {/* <Button onClick={toggleEditMove} className='d-block' value={index}>Add Move</Button> */}
                </Card.Text>
            </Card.Body>
        </Card>
    ))

    return (
        <div className='d-block'>
            {user === "opponentTeam" ?
                <h1>Opponent team: {teams.team_name}</h1> :
                <h1>My team: {teams.team_name}</h1>
            }
            <div className="d-flex bd-highlight">{opponentPokemons}</div>
        </div>
    )
}

export default ViewPokemon