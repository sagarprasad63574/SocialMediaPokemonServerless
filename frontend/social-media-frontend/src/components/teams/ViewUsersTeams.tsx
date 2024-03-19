import React, { useState } from 'react'
import Card from 'react-bootstrap/esm/Card'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/esm/Button'
import BattleLogView from '../battlelog/BattleLogView'
import { useSelector } from 'react-redux'
import { postTeamWithId } from '../../api/postedTeams/postedTeamsAPI'
import ViewPokemon from './ViewPokemon'


const ViewUsersTeams = ({ userTeams, team, team_index, setTeams, handlePost }: any) => {
    const [pokemonIndex, setPokemonIndex] = useState(null);
    
    const userTeam = team.map((team: any, index: number) => (
        <div key={team.team_id}>
            <Card className="my-4" style={{ width: '100%' }}>
                <Card.Body >
                    <Card.Title>{team.team_name}</Card.Title>
                    <Card.Text>
                        Loss: {team.loss} <br />
                        Win: {team.win} <br />
                        Points: {team.points}
                    </Card.Text>
                    <div className='mt-1'>
                        {team.post ?
                            <p>Click to view details about a post</p> :
                            <Button value={team_index} onClick={(event) => handlePost(event)}>Post</Button>
                        }
                    </div>
                    <div className="mt-1">
                        <Card.Link as={Link} to={`/teams/${team.team_id}`}>
                            <Button variant="primary">View Team In Detail</Button>
                        </Card.Link>
                        <Card.Link as={Link} to={`/battle`}>
                            <Button variant="primary">Battle</Button>
                        </Card.Link>
                    </div>
                </Card.Body>
            </Card>
            <ViewPokemon
                pokemons={team.pokemons}
                team_index={team_index}
                pokemonIndex={pokemonIndex}
                setPokemonIndex={setPokemonIndex}
                userTeams={userTeams}
                setTeams={setTeams}
            />
            <BattleLogView battlelog={team.battlelog} />
        </div>
    ))
    return (
        <div>{userTeam}</div>
    )
}

export default ViewUsersTeams