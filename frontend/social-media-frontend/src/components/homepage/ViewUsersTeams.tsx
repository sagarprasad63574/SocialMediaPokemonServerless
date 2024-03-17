import React from 'react'
import Card from 'react-bootstrap/esm/Card'
import ViewPokemon from './ViewPokemon'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/esm/Button'
import BattleLogView from '../battlelog/BattleLogView'


const ViewUsersTeams = ({ userTeams, index }: any) => {
    const userTeam = userTeams.map((team: any, index: number) => (
        <div key={team.team_id}>
            <Card className="my-4" style={{ width: '100%' }}>
                <Card.Body >
                    <Card.Title>{team.team_name}</Card.Title>
                    <Card.Text>
                        Loss: {team.loss} <br />
                        Win: {team.win} <br />
                        Points: {team.points}
                    </Card.Text>
                    <div className="mt-2">
                        <Card.Link as={Link} to={`/teams/${team.team_id}`}>
                            <Button variant="primary">View Team In Detail</Button>
                        </Card.Link>
                    </div>
                </Card.Body>
            </Card>
            <ViewPokemon pokemons={team.pokemons} />
            <BattleLogView battlelog={team.battlelog} />
        </div>
    ))
    return (
        <div>{userTeam}</div>
    )
}

export default ViewUsersTeams