import React from "react";
import { Button, Form } from "react-bootstrap";
import { getCommentsForTeam, postComment } from "../../api/comments/commentAPI";
import { useSelector } from "react-redux";

const AddCommentForm = ({setComments, teamID}: any) => {
    const {userToken} = useSelector((state: any) => state.auth);
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const elems = event.target;
        const commBody = {
            team_id: teamID,
            rating: Number(elems[0].value),
            comment: elems[1].value
        };
        try {
            let data = await postComment(userToken, commBody);
            let newComms = await getCommentsForTeam(userToken, teamID);
            setComments(newComms.comments);
        } catch (error) {
            console.log("ERROR HERE: ", error);
        }
    }
    return (
        <div>
            <h2>Add Comment</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formRating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control type="text" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formComment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control as="textarea" rows={3} required placeholder="Enter comment here" />
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
                <Button type="reset">Reset</Button>
            </Form>
            <hr/>
        </div>
    )
};
export default AddCommentForm;