import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { convertTimestampToUTC } from "../../api/comments/commentAPI";

const ViewCommentsForTeam = ({comments}: any) => {
    console.log("Team Comments: ", comments);
    return (
        <div>
            {comments && (
                <ListGroup>
                    {comments.map((comment: any, index: number) => (
                        <ListGroup.Item key={index}>
                            <strong>{comment.username}</strong>
                            {comment.comments.map((innerComment: any, innerIndex: number) => (
                                <Card key={innerIndex}>
                                    <Card.Body>
                                        <Card.Title>Rating: {innerComment.rating}</Card.Title>
                                        <Card.Subtitle>{convertTimestampToUTC(innerComment.timestamp)}</Card.Subtitle>
                                        <Card.Text>{innerComment.comment}</Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
            <hr />
        </div>
    );
}

export default ViewCommentsForTeam;