import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPostedTeamWithId } from "../../api/postedTeams/postedTeamsAPI";
import { useParams } from "react-router-dom";
import PostedTeamScreen from "./postedTeamScreen";
import AddCommentForm from "./AddCommentForm";
import ViewCommentsForTeam from "./ViewCommentsForTeam";
import { getCommentsForTeam } from "../../api/comments/commentAPI";

const PostedTeamContainer = () => {
    const {teamID} = useParams();
    const {userToken} = useSelector((state: any) => state.auth);
    const [postedTeam, setPostedTeam] = useState({});
    const [comments, setComments] = useState([]);
    useEffect(() => {
        async function retrieveTeam(){
            try {
                let team = await getPostedTeamWithId(userToken, teamID);
                setPostedTeam(team);
            } catch (error) {
                console.log(error);
            }
        }
        retrieveTeam();
        async function retrieveComments(){
            try {
                let newComms = await getCommentsForTeam(userToken, teamID);
                setComments(newComms.comments);
            } catch (error) {
                console.log(error);
            }
        }
        retrieveComments();
    }, [userToken]);
    return (
        <div>
            {postedTeam && (
                <div>
                    <PostedTeamScreen postedTeam={postedTeam}/>
                    <h2>View Comments</h2>
                    <ViewCommentsForTeam comments={comments}/>
                    <AddCommentForm setComments={setComments} teamID={teamID}/>
                </div>
            )}
        </div>
    );
};

export default PostedTeamContainer;