import React from 'react'
import Accordion from 'react-bootstrap/esm/Accordion';
import ViewUsersTeam from './ViewUsersTeams';

const ViewAllPostedTeams = ({ postedTeams, teamComments }: any) => {
    const teams = postedTeams.map((teams: any, index: number) => (
        <Accordion.Item key={teams.user_id} eventKey={`${index}`} style={{backgroundColor: "#98B4D4"}}>
            <Accordion.Header>{teams.username}</Accordion.Header>
            <Accordion.Body>
                    <ViewUsersTeam userTeams={teams.teams} index={index} teamComments={teamComments}/>
            </Accordion.Body>
        </Accordion.Item>   
        )
    )

    return (
        <Accordion defaultActiveKey="0" >
            {teams}
        </Accordion>

    )
};
export default ViewAllPostedTeams;