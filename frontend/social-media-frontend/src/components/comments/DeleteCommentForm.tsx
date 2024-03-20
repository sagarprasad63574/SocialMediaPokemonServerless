import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { deleteComment, getCommentsFromUser } from "../../api/comments/commentAPI";

const DeleteCommentForm = ({ comments, setComments, setVisible }: any) => {
    const { userToken } = useSelector((state: any) => state.auth);
    const [cindex, setCindex] = useState(-1);
    const [hasindex, setHasIndex] = useState(false);
    const [isShown, setIsShown] = useState(false);
    const handleIndexForm = (event: any) => {
        event.preventDefault();
        const elems = event.target;
        const commInd = Number(elems[0].value);
        if (isNaN(commInd) || commInd < 0 || commInd > comments.length) {
            setHasIndex(false);
            return;
        }
        setCindex(commInd);
        setHasIndex(true);
        setIsShown(true);
    }
    const handleConfirm = async () => {
        try {
            const data = await deleteComment(userToken, cindex);
            const newComms = await getCommentsFromUser(userToken);
            setComments(newComms.comments);
            setCindex(-1);
            setHasIndex(false);
            setVisible(false);
        } catch (error) {
            console.log("error: ", error);
        }
    }
    const handleRevert = () => {
        setCindex(-1);
        setHasIndex(false);
        setVisible(false);
    }
    return (
        <div>
            {!hasindex && <Form onSubmit={handleIndexForm}>
                <Form.Group className="mb-3" controlId="formCommentIndex">
                    <Form.Label>Comment Index</Form.Label>
                    <Form.Control type="text" />
                    <Button type="submit">Search</Button>
                </Form.Group>
            </Form>}
            {hasindex && <Modal show={isShown} onHide={handleConfirm}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm to Delete Comment #{cindex}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Text of comment reads "{comments[cindex].comment}"<br/>
                    Rating of comment is {comments[cindex].rating}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleConfirm}>
                        Delete Comment
                    </Button>
                    <Button variant="primary" onClick={handleRevert}>
                        Revert
                    </Button>
                </Modal.Footer>
            </Modal>}
        </div>
    )
};

export default DeleteCommentForm;