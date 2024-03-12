import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AddTeam } from '../../api/teams/teamAPI'
import Error from '../common/Error';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Spinner from '../common/Spinner';

const TeamScreen = () => {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(0);
    const [teams, setTeams]: any = useState({});
    const { loading, userInfo, userToken, error, success } = useSelector(
        (state: any) => state.auth
    )

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { register, handleSubmit } = useForm()

    const submitForm = async (data: any) => {
        try {
            let teams = await AddTeam(userToken, data);
            setMessage(teams.message);
            if (teams.status) {setStatus(status)} else {setStatus(201)};
            setTeams(teams.teams);

        } catch (error: any) {
            console.log("IAM HERE", error);
        }
    }

    return (

        status===201 ? (
            <div>
            <h1>Message: {message}</h1>
            <ul>
                <li>Team Name: {teams.team_name}</li>
                <li>Loss: {teams.loss}</li>
                <li>Win: {teams.win}</li>
                <li>Points: {teams.points}</li>
                <li>Index: {teams.index}</li>
            </ul>
            </div>

        ) : (
            <form onSubmit={handleSubmit(submitForm)}>
                {<Error>{message}</Error>}
                <div className='form-group'>
                    <label htmlFor='team_name'>Team Name</label>
                    <input
                        type='text'
                        className='form-input'
                        {...register('team_name')}
                        required
                    />
                </div>
                <button type='submit' className='button' disabled={loading}>
                    {loading ? <Spinner /> : 'Add'}
                </button>
            </form>
        )
    );
}

export default TeamScreen