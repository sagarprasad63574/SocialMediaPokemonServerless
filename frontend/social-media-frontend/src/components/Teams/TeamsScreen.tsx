import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getTeams from '../../features/teams/teamsActions'

const TeamScreen = () => {
  const { userToken } = useSelector((state: any) => state.auth)
  console.log("Hello Team Screen", userToken);
  const [data, setData]: any = useState({});

  useEffect(() => {
    getTeams(userToken)
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  console.log(data);
  return (
    <div>
      <h1>{data.message}</h1>
      <ul>
        <li>{data.teams[0].team_name}</li>
    
      </ul>
    </div>
  )
}

export default TeamScreen