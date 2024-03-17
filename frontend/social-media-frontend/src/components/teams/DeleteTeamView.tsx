import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'
import Modal from 'react-bootstrap/esm/Modal'
import { useSelector } from 'react-redux'
import { DeleteTeam } from '../../api/teams/teamAPI'
import Error from '../common/Error';

const DeleteTeamView = ({ team, team_index, userTeams, setTeams, show, handleClose }: any) => {
    const { userToken } = useSelector((state: any) => state.auth)

    const [data, setData] = useState({
        team_name: "",
    });

    const [message, setMessage] = useState("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const deleteTeam = await DeleteTeam(userToken, team_index);
            setMessage(deleteTeam.message);
            if (deleteTeam.response) {
                const removeTeamFromUserTeams = userTeams.filter((team: any, index: any) => index != team_index);
                setTeams(removeTeamFromUserTeams)
            }
            handleClose();
        } catch (error: any) {
            console.log("HEllo I am here: ", error);
        }
    }

    return (

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Team?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Delete team: {team.team_name}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    No
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
        // <Container className="d-grid justify-content-center">
        //     <Button variant="primary" type="submit">
        //         Submit
        //     </Button>
        // </Container>
    )
}

export default DeleteTeamView