import React from 'react'

function ViewMyTeams({ teams }: any) {
    const listItems = teams.map((team: any) =>
      <li key={team.team_id}>
        {team.team_name}
        <p>
          <br />
          LOSS: {team.loss} <br />
          WIN: {team.win} <br />
          POINTS: {team.points}
        </p>
      </li>
    );
    
    return (

        <div>
            {
                teams.length ? (
                    <div>
                        {/* <h1>{teams.message}</h1> */}
                        <ul>{listItems}</ul>
                    </div>
                ) : (
                  <div> Please Create A Team  </div>
                )
            }
        </div>
    )
}

export default ViewMyTeams