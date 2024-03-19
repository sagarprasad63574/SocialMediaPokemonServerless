import React, { useEffect, useState } from 'react'
import Error from '../common/Error';
import ViewComments from './ViewComments';
import { useSelector } from 'react-redux';
import { getCommentsFromUser } from '../../api/comments/commentAPI';
import { Button } from 'react-bootstrap';
import EditCommentForm from './EditCommentForm';
import DeleteCommentForm from './DeleteCommentForm';

const CommentsContainer = () => {
    const {userToken, userInfo, error} = useSelector((state: any) => state.auth);
    const [comments, setComments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    useEffect(() => {
        async function myComments(){
            try {
                let foundComments = await getCommentsFromUser(userToken);
                if(foundComments.comments){
                    setComments(foundComments.comments);
                }
            } catch (error) {
                console.log(error);
            }
        }
        myComments();
    }, [userToken]);
    const handleEditButton = (event: any) => {
        event.preventDefault();
        setIsEditing(!isEditing);
    }
    const handleDeleteButton = (event: any) => {
        event.preventDefault();
        setIsDeleting(!isDeleting);
    }
    return (
        <div>
            {error && <Error>{error}</Error>}
            {comments && (
                <div>
                    <h3>Comments made by user {userInfo?.username}</h3>
                    <Button onClick={handleEditButton}>Edit Comments</Button>
                    <Button onClick={handleDeleteButton}>Delete Comments</Button>
                </div>
            )}
            {!comments && (
                <div>
                    <h3>User {userInfo?.username} has not posted any comments</h3>
                    <h4>Go onto a team page in order to add a comment, and those comments will show up here</h4>
                </div>
            )}
            {isEditing && <EditCommentForm comments={comments} setComments={setComments} setVisible={setIsEditing}/>}
            {isDeleting && <DeleteCommentForm comments={comments} setComments={setComments} setVisible={setIsDeleting}/>}
            {(comments && !isEditing && !isDeleting) && <ViewComments comments={comments} />}
        </div>
    );
};
export default CommentsContainer