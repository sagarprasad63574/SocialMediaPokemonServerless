import React from 'react';
import { convertTimestampToUTC } from '../../api/comments/commentAPI';
import { Button, ListGroup } from 'react-bootstrap';

const ViewComments = (props: any) => {
    const {comments} = props;
    return (
        <div>
            {comments && (
                 <ListGroup>
                 {comments.map((comment: any, index: number) => (
                     <ListGroup.Item key={index}>
                         TeamID: {comment.team_id}<br/>
                         Rating: {comment.rating}<br/>
                         Message: {comment.comment}<br/>
                         Posted on: {convertTimestampToUTC(comment.timestamp)}<br/>
                     </ListGroup.Item>
                 ))}
                </ListGroup>
            )}
        </div>
    );
};

export default ViewComments;