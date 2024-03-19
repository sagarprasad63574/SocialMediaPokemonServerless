import React from 'react'
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import ListGroup from 'react-bootstrap/esm/ListGroup';

const ConductFightSequence = ({ user_team_name, opponent_team_name, opponent_id, yourTeam, opponentTeam, battleResult }: any) => {

  const battleSummary = battleResult.summary.map((sum: any, index: any) => {
    return <ListGroup.Item>{sum}</ListGroup.Item>
  })

  const battleDetails = battleResult.details.map((sum: any, index: any) => {
    
    return <p>{sum}</p>
    
    // return (
    //   <ListGroup key={index}>
    //     <ListGroup>
    //       <ListGroup.Item>{sum}</ListGroup.Item>
    //     </ListGroup>
    //   </ListGroup>
    // )
  })

  return (
    <div>
      <h1>BATTLE</h1>
      <h5>User Team Name: {user_team_name}</h5>
      <h5>Opponent Team Name: {opponent_team_name}</h5>
      <h5>Opponent Id: {opponent_id}</h5>
      <h5>Message: {battleResult.message}</h5>
      {battleResult.summary ? <ListGroup>{battleSummary}</ListGroup> : <h5>No summary</h5>}
      {battleResult.details ? <ListGroup>
        {battleDetails}</ListGroup> : <h5>No details</h5>}

    </div>
  )
}

export default ConductFightSequence