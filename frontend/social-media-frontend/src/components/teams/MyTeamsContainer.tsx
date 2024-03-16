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
import DeleteTeamContainer from './DeleteTeamContainer';

const TeamScreen = () => {
  const { userToken, userInfo, error } = useSelector((state: any) => state.auth); //redux state
  console.log("Hello Team Screen: TOKEN", userToken);

  const [message, setMessage]: any = useState("");
  const [teams, setTeams]: any = useState([]);

  useEffect(() => {
    async function myTeams() {
      try {
        let userTeams = await getTeams(userToken);
        setMessage(userTeams.message);
        setTeams(userTeams.teams);
        console.log(userTeams.teams)
      } catch (error) {
        console.log(error);
      }
    }
    myTeams();

  }, [userToken]);

  return (
    <div>
      {error && <Error>{error}</Error>}
      {message && <h1 className="text-center p-4">{message}</h1>}
      <div className="my-4"> <ProfileCard user={userInfo} /> </div>
      <h1>
        <AddTeamContainer />
        <DeleteTeamContainer />
      </h1>
      {teams.length ?
        <ViewMyTeams userTeams={teams} /> :
        <div> Please Create A Team  </div>
      }
    </div>
  );
}

export default TeamScreen