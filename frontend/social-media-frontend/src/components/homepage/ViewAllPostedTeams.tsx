import React from 'react'
import Accordion from 'react-bootstrap/esm/Accordion';
import ViewUsersTeam from './ViewUsersTeams';

const ViewAllPostedTeams = ({ postedTeams }: any) => {
    console.log(postedTeams);
    const teams = postedTeams.map((teams: any, index: number) => (
        <Accordion.Item key={teams.team_id} eventKey={`${index}`}>
            <Accordion.Header key={teams.team_id} >{teams.username}</Accordion.Header>
            <Accordion.Body key={teams.team_id} >
                    <ViewUsersTeam userTeams={teams.teams} index={index}/>
            </Accordion.Body>
        </Accordion.Item>
        )
    )

    return (
        <Accordion defaultActiveKey="0">
            {teams}
        </Accordion>

    )
};
export default ViewAllPostedTeams;