import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/esm/Form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { EditTeam } from '../../api/teams/teamAPI'
import Error from '../common/Error';

const EditTeamView = ({team_index, userTeams, setTeams}: any) => {

    const { userToken } = useSelector((state: any) => state.auth)

    const [data, setData] = useState({
        team_name: "",
    });

    const [message, setMessage] = useState("");

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const newTeam = await EditTeam(userToken, team_index, data);
            setMessage(newTeam.message);
            if (newTeam.response) setTeams([...userTeams], userTeams[team_index].team_name = data.team_name);

        } catch (error: any) {

            console.log("HEllo I am here: ", error);
        }
    }

    return (
        <Container className="d-grid justify-content-center">
            {message && <Error>{message}</Error>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="team_name">
                    <Form.Label>Team Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Team Name"
                        onChange={(event) => setData({ ...data, team_name: event.target.value })} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    )
}

export default EditTeamView