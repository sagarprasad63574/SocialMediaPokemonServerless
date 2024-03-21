import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getAllPostedTeams } from '../../api/postedTeams/postedTeamsAPI';
import ViewPostedTeams from './SetUpTeams';
import { getTeams } from '../../api/teams/teamAPI';

const BattleSimulatorContainer = () => {
    const { userToken, userInfo } = useSelector((state: any) => state.auth);
    const [postedTeams, setPostedTeams] = useState([]);
    const [myTeams, setMyTeams] = useState([]);

    const [yourTeam, setYourTeam] = useState({
        team_name: "",
        team_id: ""
    });

    const [selectedOpponentTeam, setSelectedOpponentTeam] = useState({
        opponent_id: "",
        team_name: "",
        team_id: "",
        loss: "",
        win: "",
        points: "",
        pokemons: [],
        battlelog: []
    });

    useEffect(() => {
        async function allPostedTeams() {
            try {
                let posts = await getAllPostedTeams(userToken);
                if (posts.response) setPostedTeams(posts.teams);
            } catch (error) {
                console.log(error);
            }
        }

        async function allMyTeams() {
            try {
                let myTeams = await getTeams(userToken);
                if (myTeams.response) setMyTeams(myTeams.teams);
            } catch (error) {
                console.log(error);
            }
        }

        allPostedTeams();
        allMyTeams();
    }, [userToken]);
    return (
        <div className='mt-4'>
            <h1 className="text-center">Battle Simulator</h1>
            {postedTeams.length ?
                <ViewPostedTeams
                    postedTeams={postedTeams}
                    myTeams={myTeams}
                    yourTeam={yourTeam}
                    setYourTeam={setYourTeam}
                    selectedOpponentTeam={selectedOpponentTeam}
                    setSelectedOpponentTeam={setSelectedOpponentTeam}

                /> :
                <div>No Posted Teams</div>
            }
        </div>
    )
}

export default BattleSimulatorContainer