import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/esm/Card'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/esm/Button'
import BattleLogView from '../battlelog/BattleLogView'
import { useSelector } from 'react-redux'
import { postTeamWithId } from '../../api/postedTeams/postedTeamsAPI'
import ViewPokemon from './ViewPokemon'
import ViewCommentsForTeam from '../postedTeam/ViewCommentsForTeam'


const ViewUsersTeams = ({ userTeams, team_index, setTeams, teamComments }: any) => {

    const { userToken } = useSelector((state: any) => state.auth)
    const handlePost = async (event: any) => {
        event.preventDefault();
        try {
            console.log("What is my token", userToken)
            const postTeam = await postTeamWithId(userToken, team_index);
            console.log(postTeam)
            //if (newTeam.response) setTeams([...userTeams], userTeams[team_index].team_name = data.team_name);
        } catch (error: any) {
            console.log("HEllo I am here: ", error);
        }
    }


    const getCommentsOfTeam = (team_id: string) => {
        let teamC = teamComments.filter((comms: any) => comms.team_id === team_id);
        if(!teamC || !teamC.length) return null;
        return teamC[0].comments;
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
                        <Card.Link as={Link} to={`/battle`}>
                            <Button variant="primary">Battle</Button>
                        </Card.Link>
                    </div>
                </Card.Body>
            </Card>
            <ViewPokemon pokemons={team.pokemons} />
            <BattleLogView battlelog={team.battlelog} />
            <hr />
            {getCommentsOfTeam(team.team_id) && (
                <div>
                    <h4>Comments</h4>
                    <ViewCommentsForTeam comments={getCommentsOfTeam(team.team_id)}/>
                </div>
            )}
        </div>
    ))
    return (
        <div>{userTeam}</div>
    )
}

export default ViewUsersTeams