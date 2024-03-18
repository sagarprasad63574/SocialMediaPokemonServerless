import React from 'react'
import { Accordion, Card, CardBody, ListGroup } from 'react-bootstrap';

const PostedTeamScreen = ({ postedTeam }: any) => {
    const foundTeam = postedTeam?.foundTeam;
    const pokemons = foundTeam?.team.pokemons;
    const getTypesString = (typeArr: any[]) => {
        let tString = `[${typeArr[0].type.name}`;
        for (let i = 1; i < typeArr.length; i++) {
            tString += `, ${typeArr[i].type.name}`;
        }
        tString += `]`;
        return tString;
    }
    return (
        postedTeam && (
            <div>
                <h1>TEAM {foundTeam?.team.team_name.toUpperCase()}</h1>
                <h4>Posted by {foundTeam?.username}</h4>
                <h5>Wins: {foundTeam?.team.win}, Losses: {foundTeam?.team.loss}</h5>
                <h5>Points: {foundTeam?.team.points}</h5>
                <hr />
                <h5>Pokemon</h5>
                <Card className='d-flex p-2 bd-highlight'>
                    {pokemons?.map((pokemon: any, index: number) => (
                        <Card.Body key={index}>
                            <Card.Img variant="top" width="200px" height="400px" src="https://fastly.picsum.photos/id/508/200/200.jpg?hmac=K4JUehX1v2yEPLUOyJDAmRhZu8PgMu4vv6ypO-CA5nw" />

                            <Card.Title>{pokemon.pokemon_name.toUpperCase()}</Card.Title>
                            <Card.Text>
                                Defense: {pokemon.defense}<br />
                                Attack: {pokemon.attack}<br />
                                HP: {pokemon.hp}<br />
                                Special Attack: {pokemon.specialattack}<br />
                                Special Defense: {pokemon.specialdefense}<br />
                                Speed: {pokemon.speed}<br />
                                Types: <strong>{getTypesString(pokemon.type)}</strong>
                            </Card.Text>

                        </Card.Body>
                    ))}
                </Card>
                <hr />
                <h5>Battlelog</h5>
                <hr />
            </div>
        )
    )
};
export default PostedTeamScreen;