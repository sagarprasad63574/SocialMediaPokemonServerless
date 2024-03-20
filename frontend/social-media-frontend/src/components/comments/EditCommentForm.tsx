import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { getCommentsFromUser, updateComment } from "../../api/comments/commentAPI";
import { useSelector } from "react-redux";

const EditCommentForm = ({comments, setComments, setVisible}: any) => {
    const {userToken} = useSelector((state: any) => state.auth);
    const [cindex, setCindex] = useState(-1);
    const [hasindex, setHasIndex] = useState(false);
    const handleIndexForm = (event: any) => {
        event.preventDefault();
        const elems = event.target;
        const commInd = Number(elems[0].value);
        if(isNaN(commInd) || commInd < 0 || commInd > comments.length){
            setHasIndex(false);
            return;
        }
        setCindex(commInd);
        setHasIndex(true);
    };
    const handleEditForm = async (event: any) => {
        event.preventDefault();
        const elems = event.target;
        const newCommBody = {
            team_id: comments[cindex].team_id,
            rating: Number(elems[0].value),
            comment: elems[1].value
        };
        try {
            const data = await updateComment(userToken, newCommBody, cindex);
            const newComms = await getCommentsFromUser(userToken);
            setComments(newComms.comments);
            setCindex(-1);
            setHasIndex(false);
            setVisible(false);
        } catch (error) {
            console.log("error: ", error);
        }
    }
    const handleRevert = (event: any) => {
        event.preventDefault();
        setCindex(-1);
        setHasIndex(false);
        setVisible(false);
    };
    return (
        <div>
            {!hasindex && <Form onSubmit={handleIndexForm}>
                <Form.Group className="mb-3" controlId="formCommentIndex">
                    <Form.Label>Comment Index</Form.Label>
                    <Form.Control type="text" />
                    <Button type="submit">Search</Button>
                </Form.Group>
            </Form>}
            {hasindex && (
                <Form onSubmit={handleEditForm}>
                    <Form.Group className="mb-3" controlId="formRating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control type="text" required placeholder={comments[cindex].rating}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formComment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control as="textarea" rows={3} required placeholder={comments[cindex].comment} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                    <Button type="reset">Reset</Button>
                    <Button onClick={handleRevert}>Revert</Button>
                </Form>
            )}
        </div>
    )
};

export default EditCommentForm;