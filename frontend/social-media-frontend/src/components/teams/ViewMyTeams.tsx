import React, { useState } from 'react'
import Accordion from 'react-bootstrap/esm/Accordion';
import ViewPokemon from '../homepage/ViewPokemon';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import { Link } from 'react-router-dom';
import TestComponent from '../TestComponent/TestComponent';
import EditTeamView from './EditTeamView';
import DeleteTeamView from './DeleteTeamView';
import { useSelector } from 'react-redux';
import ViewUsersTeams from './ViewUsersTeams';
import { postTeamWithId } from '../../api/postedTeams/postedTeamsAPI';
import Nav from 'react-bootstrap/esm/Nav';

const ViewMyTeams = ({ userTeams, setTeams }: any) => {

  console.log("USER TEAMS IS HERE", userTeams)
  const [editTeamName, setEditTeamName] = useState(false);
  const [show, setShow] = useState(false);
  const { userToken, userInfo, error } = useSelector((state: any) => state.auth); //redux state

  const toggleEditTeam = () => {
    setEditTeamName((editTeamName) => !editTeamName)
  }

  const handlePost = async (event: any) => {
    event.preventDefault();
    console.log(event.target.value)
    try {
      console.log("Current user token", userToken)

      const postTeam = await postTeamWithId(userToken, event.target.value);
      if (postTeam.response) {
        setTeams([...userTeams], userTeams[event.target.value].post = true)
      }
    } catch (error: any) {
      console.log("HEllo I am here: ", error);
    }
  }

  const listUserTeams = userTeams.map((teams: any, index: any) =>
    <Accordion.Item key={teams.team_id} eventKey={`${index}`}>
      <Accordion.Header >{teams.team_name} </Accordion.Header>
      <Accordion.Body >
        <div className="float-end mb-3">
          <Card.Link as={Link} to={`/search`}>
            <Button variant="primary">Add Pokemon</Button>
          </Card.Link>
          <Button onClick={toggleEditTeam} className='pull-right mx-2'>Edit Team Name</Button>
          <Button onClick={() => setShow(true)}>Delete Team</Button>
          {editTeamName && <EditTeamView
            team_index={index}
            userTeams={userTeams}
            setTeams={setTeams} />}
          {show && <DeleteTeamView
            team={teams}
            team_index={index}
            userTeams={userTeams}
            setTeams={setTeams}
            show={show}
            setShow={setShow}
          />}
        </div>
        <ViewUsersTeams userTeams={userTeams} team={[teams]} team_index={index} setTeams={setTeams} handlePost={handlePost} />
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