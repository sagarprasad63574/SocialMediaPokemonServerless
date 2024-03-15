import React from 'react'
import Card from 'react-bootstrap/esm/Card'
import ViewPokemon from './ViewPokemon'


const ViewUsersTeam = ({ userTeams, index }: any) => {
    const userTeam = userTeams.map((team: any, index: number) => (
        <Card style={{ width: '100%' }} key={team.team_id}>
            <Card.Body>
                <Card.Title>{team.team_name}</Card.Title>
                <Card.Text>
                    Loss: {team.loss} <br />
                    Win: {team.win} <br />
                    Points: {team.points}
                </Card.Text>
                <ViewPokemon pokemons={team.pokemons} />
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
            </Card.Body>
        </Card>
    ))
    return (
        <>{userTeam}</>
    )
}

export default ViewUsersTeam