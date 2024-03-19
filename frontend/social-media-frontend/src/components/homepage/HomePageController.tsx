import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getAllPostedTeams } from '../../api/postedTeams/postedTeamsAPI';
import ViewAllPostedTeams from './ViewAllPostedTeams';
import ProfileCard from '../profiles/ProfileCard';
import { getCommentsForAllTeams } from '../../api/comments/commentAPI';

const HomePageController = () => {
    const { userToken, userInfo } = useSelector((state: any) => state.auth);
    const [postedTeams, setPostedTeams] = useState([]);
    const [allTeamComments, setAllTeamComments] = useState([] as any);
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
        async function getAllTeamComments(){
            try {
                const allTeamComms = await getCommentsForAllTeams(userToken);
                console.log(allTeamComms.comments);
                setAllTeamComments(allTeamComms.comments);
            } catch (error) {
                console.log(error);
            }
            
        }
        getAllTeamComments();
    }, [userToken]);

    return (
        <div>
            <h1 className="display-2 text-center">Welcome To Social Media Pokemon!</h1>
            <div className="my-4"> <ProfileCard user={userInfo} /> </div>
            <p>Below are a list of posted teams!</p>
            {postedTeams.length ?
                <ViewAllPostedTeams postedTeams={postedTeams} teamComments={allTeamComments} /> :
                <div>No Posted Teams</div>
            }
        </div>
    )
}

export default HomePageController;