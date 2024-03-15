import React, { useEffect, useState } from 'react'
import Error from '../common/Error';
import ViewComments from './ViewComments';
import { useSelector } from 'react-redux';
import { getCommentsFromUser } from '../../api/comments/commentAPI';

const CommentsContainer = () => {
    const {userToken, userInfo, error} = useSelector((state: any) => state.auth);
    const [comments, setComments] = useState([]);
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
    return (
        <div>
            {error && <Error>{error}</Error>}
            <h3>Comments made by user {userInfo?.username}</h3>
            {comments && <ViewComments comments={comments} />}
        </div>
    );
};
export default CommentsContainer