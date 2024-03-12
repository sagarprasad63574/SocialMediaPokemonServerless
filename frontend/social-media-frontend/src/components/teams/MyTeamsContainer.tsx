import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getTeams from '../../features/teams/teamsActions'
import ViewMyTeams from './ViewMyTeams';
import Error from '../common/Error';

const TeamScreen = () => {
  const { userToken, error } = useSelector((state: any) => state.auth);
  console.log("Hello Team Screen: TOKEN", userToken);

  const [message, setMessage]: any = useState("");
  const [teams, setTeams]: any = useState([]);

  useEffect(() => {
    async function myTeams() {
      try {
        let teams = await getTeams(userToken);
        setMessage(teams.message);
        if(teams.teams) setTeams(teams.teams);
      } catch (error) {
        console.log(error);
      }
    }
    myTeams();

  }, [userToken]);

  return (
    <div>
      {error && <Error>{error}</Error>}
      {message && <h1>{message}</h1>}
      <ViewMyTeams teams={teams}/>

    </div>
  );
}

export default TeamScreen