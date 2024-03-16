import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPostedTeamWithId } from "../../api/postedTeams/postedTeamsAPI";
import { useParams } from "react-router-dom";
import PostedTeamScreen from "./PostedTeamScreen";
import { getCommentsForTeam } from "../../api/comments/commentAPI";
import AddCommentForm from "./AddCommentForm";
import ViewCommentsForTeam from "./ViewCommentsForTeam";

const PostedTeamContainer = () => {
    const {teamID} = useParams();
    const {userToken} = useSelector((state: any) => state.auth);
    const [postedTeam, setPostedTeam] = useState({});
    const [comments, setComments] = useState([]);
    useEffect(() => {
        async function retrieveTeam(){
            try {
                let team = await getPostedTeamWithId(userToken, teamID);
                console.log(team);
                setPostedTeam(team);
            } catch (error) {
                console.log(error);
            }
        }
        async function retrieveComments(){
            try {
                let foundComments = await getCommentsForTeam(userToken, teamID);
                setComments(foundComments.comments);
            } catch (error) {
                console.log(error);
            }
        }
        retrieveTeam();
        retrieveComments();
    }, [userToken]);
    return (
        <div>
            {postedTeam && (
                <div>
                    <PostedTeamScreen postedTeam={postedTeam}/>
                    <AddCommentForm setComments={setComments} teamID={teamID}/>
                    <ViewCommentsForTeam comments={comments}/>
                </div>
            )}
        </div>
    );
};

export default PostedTeamContainer;