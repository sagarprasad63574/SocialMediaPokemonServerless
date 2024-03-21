import React from 'react'
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import Carousel from 'react-bootstrap/esm/Carousel';
import ListGroup from 'react-bootstrap/esm/ListGroup';

const ConductFightSequence = ({ user_team_name, opponent_team_name, opponent_id, yourTeam, opponentTeam, battleResult }: any) => {

  // const battleSummary = battleResult.summary.map((sum: any, index: any) => {
  //   return <ListGroup.Item className='' key={index}>{sum}</ListGroup.Item>
  // })

  const battleSummary = battleResult.summary.map((sum: any, index: any) => {
    return <li className='' key={index}>{sum}</li>
  })

  const battleDetails = battleResult.details.map((summary: any, index: any) => {
    return <Carousel.Item key={index}>
      <div key={index} style={{ padding: "50px 150px 50px 150px" }}>{summary}</div>
    </Carousel.Item>
  })

  return (
    <div>
      <h1 className='text-center my-4'>BATTLE</h1>
      <h4>
        User Team Name: {user_team_name} <br />
        Opponent Team Name: {opponent_team_name} <br />
        Message: {battleResult.message} <br />
      </h4>
      <div>
        <h4 className='mt-4'>Summary:</h4>
        {battleResult.summary ? <ul style={{ width: '18rem' }}>{battleSummary}</ul> : <h4>No summary</h4>}
        {/* {battleResult.summary ? <ListGroup style={{ width: '18rem' }}>{battleSummary}</ListGroup> : <h4>No summary</h4>} */}
      </div>
      <div>
        <h4 className='mt-4'>Details:</h4>
        {battleResult.details ?
          <Carousel data-bs-theme="dark">
            {battleDetails}
          </Carousel> : <h5>No details</h5>}
      </div>
    </div>
  )
}

export default ConductFightSequence