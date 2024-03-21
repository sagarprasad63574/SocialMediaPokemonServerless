import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getAllPostedTeams } from '../../api/postedTeams/postedTeamsAPI';
import ViewAllPostedTeams from './ViewAllPostedTeams';
import ProfileCard from '../profiles/ProfileCard';
import { getCommentsForAllTeams } from '../../api/comments/commentAPI';
import './homepage.css';

const HomePageController = () => {
    const { userToken, userInfo } = useSelector((state: any) => state.auth);
    const [postedTeams, setPostedTeams] = useState([]);
    const [allTeamComments, setAllTeamComments] = useState([] as any);
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
        async function getAllTeamComments(){
            try {
                const allTeamComms = await getCommentsForAllTeams(userToken);
                setAllTeamComments(allTeamComms.comments);
            } catch (error) {
                console.log(error);
            }
            
        }
        getAllTeamComments();
    }, [userToken]);

    return (
        <div>
            <h1 className="text-center">Welcome To Social Media Pokemon!</h1> <hr/>
            
            <div className="my-4"> <ProfileCard user={userInfo} /> </div>
            <h5>Below are a list of posted teams!</h5>
            {postedTeams.length ?
                <ViewAllPostedTeams postedTeams={postedTeams} teamComments={allTeamComments} /> :
                <div>No Posted Teams</div>
            }
        </div>
    )
}

export default HomePageController;