import React from 'react'
import Card from 'react-bootstrap/esm/Card'
import Col from 'react-bootstrap/esm/Col'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Stack from 'react-bootstrap/esm/Stack'


// {
//     "defense": 78,
//     "attack": 84,
//     "hp": 78,
//     "specialattack": 109,
//     "specialdefense": 85,
//     "pokemon_name": "charizard",
//     "type": [
//         {
//             "type": {
//                 "name": "fire",
//                 "url": "https://pokeapi.co/api/v2/type/10/"
//             },
//             "slot": 1
//         },
//         {
//             "type": {
//                 "name": "flying",
//                 "url": "https://pokeapi.co/api/v2/type/3/"
//             },
//             "slot": 2
//         }
//     ],
//     "speed": 100
// }

function ViewPokemon({ pokemons }: any) {

    const getTypesString = (typeArr:any[]) => {
        console.log(typeArr.length);
        let tString = `[${typeArr[0].type.name}`;
        for(let i=1; i<typeArr.length; i++){
            tString += `, ${typeArr[i].type.name}`;
        }
        tString += `]`;
        return tString;
    }
    const userPokemons = pokemons.map((pokemon: any, index: number) => (
        <Card.Body>
            <Card.Img variant="top" width="200px" height="400px" src="https://fastly.picsum.photos/id/508/200/200.jpg?hmac=K4JUehX1v2yEPLUOyJDAmRhZu8PgMu4vv6ypO-CA5nw" />

            <Card.Title>{pokemon.pokemon_name}</Card.Title>
            <Card.Text>
                Defense: {pokemon.defense}<br/>
                Attack: {pokemon.attack}<br/>
                HP: {pokemon.hp}<br/>
                Special Attack: {pokemon.specialattack}<br/>
                Special Defense: {pokemon.specialdefense}<br/>
                Speed: {pokemon.speed}<br/>
                Types: <strong>{getTypesString(pokemon.type)}</strong>
            </Card.Text>

        </Card.Body>
    ))



    return (
        <Card >
            <div className="d-flex p-2 bd-highlight">{userPokemons}</div>
        </Card >
    )
}

export default ViewPokemon