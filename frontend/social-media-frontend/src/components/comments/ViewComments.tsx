import React from 'react';
import { convertTimestampToUTC } from '../../api/comments/commentAPI';
import { ListGroup } from 'react-bootstrap';

const ViewComments = (props: any) => {
    const {comments} = props;
    return (
        <ListGroup>
            {comments.map((comment: any, index: number) => (
                <ListGroup.Item key={index}>
                    TeamID: {comment.team_id}<br/>
                    Rating: {comment.rating}<br/>
                    Message: {comment.comment}<br/>
                    Posted on: {convertTimestampToUTC(comment.timestamp)}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default ViewComments;