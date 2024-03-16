import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AddTeam } from '../../api/teams/teamAPI'
import Error from '../common/Error';
import { useNavigate, redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Spinner from '../common/Spinner';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import MyTeamsContainer from './MyTeamsContainer';

const TeamScreen = () => {
    const [message, setMessage] = useState("");
    const [teamName, setTeamName] = useState({
        team_name: ""
    })
    const [teams, setTeams] = useState();
    const { loading, userInfo, userToken, error, success } = useSelector(
        (state: any) => state.auth
    )

    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const { register, handleSubmit } = useForm()

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        try {
            const newTeam = await AddTeam(userToken, teamName);
            console.log(newTeam);
            setMessage(newTeam.message);
            if (newTeam.teams) {
                return navigate('/teams')
            };

        } catch (error: any) {
            console.log("error: ", error);
        }
    }

    return (
        <Container className="d-grid">
            {message && <Error>{message}</Error>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="teamName">
                    <Form.Label>Add New Team</Form.Label>
                    <Form.Control type="text" placeholder="Enter team name" required
                        onChange={(event) => setTeamName({ ...teamName, team_name: event.target.value })} />
                    <Button variant="primary" type="submit">
                        Add Team
                    </Button>
                </Form.Group>
            </Form>
        </Container>
    );
}

export default TeamScreen