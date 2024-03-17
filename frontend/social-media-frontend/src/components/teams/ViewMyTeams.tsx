import React, { useState } from 'react'
import Accordion from 'react-bootstrap/esm/Accordion';
import ViewPokemon from '../homepage/ViewPokemon';
import ViewUsersTeams from '../homepage/ViewUsersTeams';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import { Link } from 'react-router-dom';
import TestComponent from '../TestComponent/TestComponent';
import EditTeamView from './EditTeamView';
import DeleteTeamView from './DeleteTeamView';

const ViewMyTeams = ({ userTeams, setTeams }: any) => {

  const [editTeamName, setEditTeamName] = useState(false);
  const [deleteTeam, setDeleteTeam] = useState(false);

  const toggleEditTeam = () => {
    setEditTeamName((editTeamName) => !editTeamName)
  }

  const toggleDeleteTeam = () => {
    setDeleteTeam((deleteTeam) => !deleteTeam)
  }

  const listUserTeams = userTeams.map((teams: any, index: any) =>
    <Accordion.Item eventKey={`${index}`}>
      <Accordion.Header >{teams.team_name} </Accordion.Header>
      <Accordion.Body >
        <div className="float-end mb-3">
          <Button onClick={toggleEditTeam} className='pull-right mx-2'>Edit Team</Button>
          <Button onClick={toggleDeleteTeam} className='pull-right'>Delete Team</Button>
          {editTeamName && <EditTeamView team_index={index} userTeams={userTeams} setTeams={setTeams}/>}
          {deleteTeam && <DeleteTeamView team={teams} team_index={index} userTeams={userTeams} setTeams={setTeams}/>}

        </div>
        <ViewUsersTeams userTeams={[teams]} />
      </Accordion.Body>
    </Accordion.Item>
  );

  return (
    <Accordion defaultActiveKey="0">
      {listUserTeams}
    </Accordion>
  )
}

export default ViewMyTeams