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
                console.log(posts);
                setPostedTeams(posts.teams);
            } catch (error) {
                console.log(error);
            }
        }
        allPostedTeams();
    }, [userToken]);

    return (
        <div>
            <h1 className="display-2 text-center">Welcome To Social Media Pokemon!</h1>
            <div className="my-4"> <ProfileCard user={userInfo} /> </div>
            <p>Below are a list of posted teams!</p>
            {postedTeams.length ?
                <ViewAllPostedTeams postedTeams={postedTeams} /> :
                <div>No Posted Teams</div>
            }
        </div>
    )
}

export default HomePageController;