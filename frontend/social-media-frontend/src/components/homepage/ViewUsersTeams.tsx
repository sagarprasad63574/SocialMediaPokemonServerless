import React from 'react'
import Card from 'react-bootstrap/esm/Card'
import ViewPokemon from './ViewPokemon'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/esm/Button'
import BattleLogView from '../battlelog/BattleLogView'
import { postedTeamWithId } from '../../api/postedTeams/postedTeamsAPI'
import { useSelector } from 'react-redux'


const ViewUsersTeams = ({ userTeams, team_index, setTeams }: any) => {

    const { userToken } = useSelector((state: any) => state.auth)

    const handlePost = async (event: any) => {
        event.preventDefault();
        try {
            console.log("What is my token", userToken)
            const postTeam = await postedTeamWithId(userToken, team_index);
            console.log(postTeam)
            //if (newTeam.response) setTeams([...userTeams], userTeams[team_index].team_name = data.team_name);

        } catch (error: any) {
            console.log("HEllo I am here: ", error);
        }
    }

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
                    <div className='mt-1'>
                        {team.post ? 
                            <p>Click to view details about a post</p>:
                            <Button onClick={handlePost}>Post</Button>
                        }
                    </div>
                    <div className="mt-1">
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