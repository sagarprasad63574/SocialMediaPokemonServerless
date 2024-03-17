import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'
import Modal from 'react-bootstrap/esm/Modal'
import { useSelector } from 'react-redux'
import { DeleteTeam } from '../../api/teams/teamAPI'
import Error from '../common/Error';

const DeleteTeamView = ({ team, team_index, userTeams, setTeams }: any) => {
    const { userToken } = useSelector((state: any) => state.auth)

    const [data, setData] = useState({
        team_name: "",
    });

    const [message, setMessage] = useState("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const deleteTeam = await DeleteTeam(userToken, team_index);
            console.log(deleteTeam);
            setMessage(deleteTeam.message);
            if (deleteTeam.response) setTeams(userTeams.splice(team_index, 1));

        } catch (error: any) {

            console.log("HEllo I am here: ", error);
        }
    }

    return (

        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            {message && <Error>{message}</Error>}
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Delete team: {team.team_name}</p>
                </Modal.Body>   

                <Modal.Footer>
                    <Button type="submit" variant="primary" onClick={handleSubmit}>Yes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
        // <Container className="d-grid justify-content-center">
        //     <Button variant="primary" type="submit">
        //         Submit
        //     </Button>
        // </Container>
    )
}

export default DeleteTeamView