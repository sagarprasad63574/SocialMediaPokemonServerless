import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'
import Modal from 'react-bootstrap/esm/Modal'
import { useSelector } from 'react-redux'
import { DeleteTeam } from '../../api/teams/teamAPI'
import Error from '../common/Error';
import Alert from 'react-bootstrap/esm/Alert'

const DeleteTeamView = ({ team, team_index, userTeams, setTeams, show, setShow }: any) => {
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
                setShow(false)
            }
        } catch (error: any) {
            console.log("error: ", error);
        }
    }
    return (
        <Alert className='my-3' variant="danger" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>DELETE TEAM: {team.team_name}</Alert.Heading>
            <Button className="float-right" variant="danger" onClick={handleSubmit}>Yes</Button>
        </Alert>
    );

}

export default DeleteTeamView