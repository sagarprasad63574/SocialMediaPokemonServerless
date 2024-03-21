import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import Carousel from 'react-bootstrap/esm/Carousel';

const ViewPokemon = ({ teams, user }: any) => {

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex: any) => {
        setIndex(selectedIndex);
    };

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
        // <Card className="mx-1" key={pokemon.pokemon_id}>
        //     <Card.Body>
        //         <Card.Img variant="top" width="200px" height="200px" src={pokemon.sprite} />
        //         <Card.Title >{pokemon.pokemon_name.toUpperCase()}</Card.Title>
        //         <Card.Text style={{ width: "200px" }}>
        //             Defense: {pokemon.defense}<br />
        //             Attack: {pokemon.attack}<br />
        //             HP: {pokemon.hp}<br />
        //             Special Attack: {pokemon.specialattack}<br />
        //             Special Defense: {pokemon.specialdefense}<br />
        //             Speed: {pokemon.speed}<br />
        //             Types: {pokemon.type.length > 0 ? <strong>{getTypesString(pokemon.type)}</strong> : []} <br />
        //             Moves: {pokemon.moves.length > 0 ? <strong>{getMovesString(pokemon.moves)}</strong> : <span>No moves added</span>}
        //             {/* <Button onClick={toggleEditMove} className='d-block' value={index}>Add Move</Button> */}
        //         </Card.Text>
        //     </Card.Body>
        // </Card>
        <Carousel.Item key={pokemon.pokemon_id} style={{height: "510px"}}>
            <img width="400px" height="400px" src={pokemon.sprite} />
            <Carousel.Caption style={{ paddingBottom: "0px"}}>
                <h6 style={{ color: "darkblue", marginTop: "200px" }}>{pokemon.pokemon_name.toUpperCase()}</h6>
                <p style={{ color: "darkblue" }}>
                    Attack: {pokemon.attack}, 
                    Defense: {pokemon.defense}, 
                    Special Attack: {pokemon.specialattack},  
                    Special Defense: {pokemon.specialdefense}, 
                    Speed: {pokemon.speed}, 
                    Hp: {pokemon.hp}, 
                    Types: {pokemon.type.length > 0 ? <strong>{getTypesString(pokemon.type)}</strong> : []}, 
                    Moves: {pokemon.moves.length > 0 ? <strong>{getMovesString(pokemon.moves)}</strong> : <span>No moves added</span>}
                    
                </p>
            </Carousel.Caption>
        </Carousel.Item>
    ))

    return (
        <div>
            {user === "opponentTeam" ?
                <h5 className='text-center mt-5' style={{color: "red"}}>Opponent team: {teams.team_name}</h5> :
                <h5 className='text-center mt-5' style={{color: "green"}}>My team: {teams.team_name}</h5>
            }
            <div className='d-flex'>
                <Carousel  data-bs-theme="dark" style={{ width: "400px", height: "400px", }} activeIndex={index} onSelect={handleSelect}>{opponentPokemons}</Carousel>
            </div>
        </div>
    )
}

export default ViewPokemon