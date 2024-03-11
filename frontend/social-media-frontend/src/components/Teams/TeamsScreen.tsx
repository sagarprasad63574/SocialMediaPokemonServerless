import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import getTeams from '../../features/teams/teamsActions'

const TeamScreen = () => {
  const { userToken } = useSelector((state: any) => state.auth);
  const { userInfo } = useSelector((state: any) => state.auth);
  console.log("Hello Team Screen USERINFO:", userInfo);
  console.log("Hello Team Screen: TOKEN", userToken);

  const [message, setMessage]: any = useState();
  const [teams, setTeams]: any = useState({});

  // async function teams(userToken: any) {
  //   const newData = await getTeams(userToken);
  //   setData(newData); 
  // }

  // teams(userToken);

  useEffect(() => {
    getTeams(userToken)
      .then((data) => {
        setTeams(data);
        // for (const [key, value] of Object.entries(teams)) {
          
        //   console.log(`${key}: ${value}`);
        // }
        console.log("line29", typeof(teams.teams));

      })
      .catch((err) => console.log(err));
  }, []);

  //console.log(data);
  console.log("I am rendered");
  return (
    <div>

      {/* {data.teams[0].map((team: any, index: any) => {
        <h1>{team}</h1>
      })} */}
      {/* <h1>{data.message}</h1> */}
      {/* <ul>
        <li>{data.teams[0].team_name}</li>
    
      </ul> */}
    </div>
  )
}

export default TeamScreen