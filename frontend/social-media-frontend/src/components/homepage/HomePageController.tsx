import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getAllPostedTeams } from '../../api/postedTeams/postedTeamsAPI';
import ViewAllPostedTeams from './ViewAllPostedTeams';
import ProfileCard from '../profiles/ProfileCard';

const HomePageController = () => {
    const { userToken, userInfo } = useSelector((state: any) => state.auth);
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
            <h1 className="display-2">WELCOME TO SOCIAL MEDIA POKEMON!</h1>
            <div className="my-4"> <ProfileCard user={userInfo} /> </div>
            {postedTeams.length ?
                <ViewAllPostedTeams postedTeams={postedTeams} /> :
                <div>No Posted Teams</div>
            }
        </div>
    )
}

export default HomePageController;