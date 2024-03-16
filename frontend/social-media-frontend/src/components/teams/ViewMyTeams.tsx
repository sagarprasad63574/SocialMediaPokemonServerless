import React from 'react'
import Accordion from 'react-bootstrap/esm/Accordion';
import ViewPokemon from '../homepage/ViewPokemon';
import ViewUsersTeams from '../homepage/ViewUsersTeams';

const ViewMyTeams = ({ userTeams }: any) => {
  const listUserTeams = userTeams.map((teams: any, index: any) =>
    <Accordion.Item eventKey={`${index}`}>
      <Accordion.Header >{teams.team_name}</Accordion.Header>
      <Accordion.Body >
        <ViewUsersTeams userTeams={[teams]} />
        
      </Accordion.Body>
    </Accordion.Item>
  );

  //   battlelog
  // : 
  // []

  return (
    <Accordion defaultActiveKey="0">
      {listUserTeams}
    </Accordion>
  )
}

export default ViewMyTeams