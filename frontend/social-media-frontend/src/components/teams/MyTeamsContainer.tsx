import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTeams } from '../../api/teams/teamAPI'
import ViewMyTeams from './ViewMyTeams';
import Error from '../common/Error';
import ViewUsersTeams from '../homepage/ViewUsersTeams';
import ProfileCard from '../profiles/ProfileCard';
import Nav from 'react-bootstrap/esm/Nav';
import Button from 'react-bootstrap/esm/Button';
import { Link } from 'react-router-dom';
import AddTeamContainer from './AddTeamContainer';
import DeleteTeamContainer from './DeleteTeamView';

const TeamScreen = () => {
  const { userToken, userInfo, error } = useSelector((state: any) => state.auth); //redux state
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function myTeams() {
      try {
        let userTeams = await getTeams(userToken);
        setMessage(userTeams.message);
        setTeams(userTeams.teams);
      } catch (error) {
        console.log(error);
      }
    }
    myTeams();

  }, [userToken])

  return (
    <div>
      {error && <Error>{error}</Error>}
      <div className="my-4"> <ProfileCard user={userInfo} /> </div>
      <h1>
        <AddTeamContainer userTeams={teams} setTeams={setTeams}/>
      </h1>
      {message && <h3 className="text-center p-3">{message}</h3>}
      {teams ?
        <ViewMyTeams userTeams={teams} setTeams={setTeams}/> :
        <div> Use the form above to add a team </div>
      }
    </div>
  );
}

export default TeamScreen