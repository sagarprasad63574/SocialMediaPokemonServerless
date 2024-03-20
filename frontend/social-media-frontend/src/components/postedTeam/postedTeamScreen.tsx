import React from 'react'
import { Accordion, Card, CardBody, ListGroup } from 'react-bootstrap';
import BattleLogView from '../battlelog/BattleLogView';
import ViewPokemon from '../homepage/ViewPokemon';

const PostedTeamScreen = ({ postedTeam }: any) => {
    const foundTeam = postedTeam?.foundTeam;
    const pokemons = foundTeam?.team.pokemons;
    const getTypesString = (typeArr: any[]) => {
        let tString = `[${typeArr[0].type.name}`;
        for (let i = 1; i < typeArr.length; i++) {
            tString += `, ${typeArr[i].type.name}`;
        }
        tString += `]`;
        return tString;
    }
    return (
        postedTeam && (
            <div>
                <h1>TEAM {foundTeam?.team.team_name.toUpperCase()}</h1>
                <h4>Posted by {foundTeam?.username}</h4>
                <h5>Wins: {foundTeam?.team.win}, Losses: {foundTeam?.team.loss}</h5>
                <h5>Points: {foundTeam?.team.points}</h5>
                <hr />
                {(pokemons && pokemons.length > 0) && 
                    <div>
                        <h5>Pokemon</h5>
                        <ViewPokemon pokemons={pokemons} />
                        <hr />
                    </div>
                }
                {foundTeam?.team.battlelog &&
                    <div>
                        <h5>Battlelog</h5>
                        <BattleLogView battlelog={foundTeam?.team.battlelog} />
                    </div>
                }
                <hr />
            </div>
        )
    )
};
export default PostedTeamScreen;