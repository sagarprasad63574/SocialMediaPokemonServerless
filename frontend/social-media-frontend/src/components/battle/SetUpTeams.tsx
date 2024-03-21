import React, { useState } from 'react'
import Dropdown from 'react-bootstrap/esm/Dropdown'
import DropdownButton from 'react-bootstrap/esm/DropdownButton'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import { getPostedTeamWithId } from '../../api/postedTeams/postedTeamsAPI'
import { useSelector } from 'react-redux'
import Button from 'react-bootstrap/esm/Button'
import { getTeamById } from '../../api/teams/teamAPI'
import TestComponent from '../TestComponent/TestComponent'
import EditTeamView from '../teams/EditTeamView'
import ConductFightSequence from './ConductFightSequence'
import ViewPokemon from './ViewPokemon'
import { BattleSimulate } from '../../api/battle/battleAPI'

const SetUpTeams = ({ postedTeams,
    myTeams,
    yourTeam,
    setYourTeam,
    selectedOpponentTeam,
    setSelectedOpponentTeam }: any) => {
    const { userToken, userInfo } = useSelector((state: any) => state.auth);
    const [battle, setBattle] = useState(false);
    const [battleResult, setBattleResult] = useState(
        {
            message: "",
            summary: [],
            details: []
        }
    );
    
    const opponentClicked = async (event: any) => {
        event.preventDefault();
        try {
            const postedTeam = await getPostedTeamWithId(userToken, event.target.value);
            if (postedTeam.response) {
                setSelectedOpponentTeam({
                    ...selectedOpponentTeam,
                    user_id: postedTeam.foundTeam.user_id,
                    team_name: postedTeam.foundTeam.team.team_name,
                    team_id: postedTeam.foundTeam.team.team_id,
                    points: postedTeam.foundTeam.team.points,
                    win: postedTeam.foundTeam.team.win,
                    loss: postedTeam.foundTeam.team.loss,
                    pokemons: postedTeam.foundTeam.team.pokemons,
                    battlelog: postedTeam.foundTeam.team.battlelog,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const yourClicked = async (event: any) => {
        event.preventDefault();
        try {
            const myTeam = await getTeamById(userToken, event.target.value);
            if (myTeam.response) {
                setYourTeam({
                    ...yourTeam,
                    team_name: myTeam.team[0].team_name,
                    team_id: myTeam.team[0].team_id,
                    points: myTeam.team[0].points,
                    win: myTeam.team[0].win,
                    loss: myTeam.team[0].loss,
                    pokemons: myTeam.team[0].pokemons,
                    battlelog: myTeam.team[0].battlelog,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const battleSim = async (event: any) => {
        event.preventDefault();
        setBattle((battle) => !battle);
        
        try {
            const simBattle = await BattleSimulate(userToken, 
                yourTeam.team_name, 
                selectedOpponentTeam.team_name, 
                selectedOpponentTeam.user_id);
            if (simBattle.response) {
                setBattleResult({...battleResult,
                    message: simBattle.message,
                    summary: simBattle.summary,
                    details: simBattle.details
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const opponentTeams = postedTeams.map((teams: any, index: number) => (
        <ListGroup.Item key={teams.user_id}>
            <h5>User: {teams.username}</h5>
            {teams.teams.map((team: any, index: any) => {
                return <div key={team.team_id}>
                    <ListGroup.Item
                        as="button" action
                        value={team.team_id}
                        onClick={(event) => opponentClicked(event)}>
                        {team.team_name}
                    </ListGroup.Item>
                </div>
            })}
        </ListGroup.Item>
    )
    )

    const yourTeams = myTeams.map((team: any, index: number) => (
        <ListGroup.Item key={team.team_id}>
            <ListGroup.Item
                key={team.team_id}
                className=''
                as="button" action
                value={team.team_id}
                onClick={(event) => yourClicked(event)}>
                {team.team_name}
            </ListGroup.Item>
        </ListGroup.Item>
    )
    )

    return (
        <div>
            <div className='d-flex' >
                <ListGroup defaultActiveKey="#link1" style={{ width: '18rem', margin: "auto" }}>
                    <h3>Opponent Teams</h3> 
                    <div>{selectedOpponentTeam.team_name ? <h5 className='text-success'>Team: {selectedOpponentTeam.team_name} selected!</h5> :
                        <h4 className='text-primary'>Select a team</h4>}</div>
                    {opponentTeams}
                </ListGroup>
                <h1 style={{ margin: "auto" }}>
                    {selectedOpponentTeam.team_name && yourTeam.team_name ?
                        <Button className='btn-lg bg-success' onClick={battleSim}>FIGHT</Button> :
                        <Button className='btn-lg bg-danger' disabled>Select Each Team</Button>
                    }

                </h1>
                <ListGroup className='d-flex' defaultActiveKey="#link1" style={{ width: '18rem', margin: "auto" }}>
                    <h3>Your Teams</h3>
                    <div>{yourTeam.team_name ? <h5 className='text-success'>Team: {yourTeam.team_name} selected!</h5> :
                        <h4 className='text-primary'>Select a team</h4>}</div>
                    {yourTeams}
                </ListGroup>
            </div>
            <div className='d-flex' style={{justifyContent: "space-between"}}>
            {selectedOpponentTeam.team_name ?
                <ViewPokemon teams={selectedOpponentTeam} user="opponentTeam"></ViewPokemon> :
                <></>}
            {yourTeam.team_name ?
                <ViewPokemon teams={yourTeam} user="yourTeam"></ViewPokemon> :
                <></>}
            </div>
            {battle && <ConductFightSequence
                user_team_name={yourTeam.team_name}
                opponent_team_name={selectedOpponentTeam.team_name}
                opponent_id={selectedOpponentTeam.user_id}
                yourTeam={yourTeam}
                opponentTeam={selectedOpponentTeam}
                battleResult={battleResult}
            />}
        </div>
    )
}

export default SetUpTeams