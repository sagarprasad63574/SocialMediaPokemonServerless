import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getAllPostedTeams } from '../../api/postedTeams/postedTeamsAPI';
import ViewAllPostedTeams from './ViewAllPostedTeams';

const HomePageController = () => {
    const { userToken } = useSelector((state: any) => state.auth);
    const [postedTeams, setPostedTeams] = useState([]);
    useEffect(() => {
        async function allPostedTeams() {
            try {
                let posts = await getAllPostedTeams(userToken);
                setPostedTeams(posts.teams);
            } catch (error) {
                console.log(error);
            }
        }
        allPostedTeams();
    }, [userToken]);
    
    return (
        <div>
            <ViewAllPostedTeams postedTeams={postedTeams}/>
        </div>
    )
}

export default HomePageController;