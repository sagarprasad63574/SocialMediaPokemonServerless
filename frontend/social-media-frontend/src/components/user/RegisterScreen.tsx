import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Error from '../common/Error'
import Spinner from '../common/Spinner'
import { registerUser } from '../../store/actions/authActions'

const RegisterScreen = () => {
    const [customError, setCustomError] = useState("")

    const { loading, userInfo, error, success } = useSelector(
        (state: any) => state.auth
    )
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { register, handleSubmit } = useForm()


    useEffect(() => {
        // redirect authenticated user to profile screen
        if (userInfo) navigate('/profile')
        // redirect user to login page if registration was successful
        if (success) navigate('/login')
    }, [navigate, userInfo, success])

    const submitForm = (data: any) => {
        // check if passwords match
        if (data.password !== data.confirmPassword) {
            setCustomError('Password mismatch')
            return
        }
        // transform email string to lowercase to avoid case sensitivity issues in login
        data.email = data.email.toLowerCase()

        dispatch(registerUser(data))
    }

    return (
        <form onSubmit={handleSubmit(submitForm)}>
            {error && <Error>{error}</Error>}
            {customError && <Error>{customError}</Error>}
            <div className='form-group'>
                <label htmlFor='name'>Name</label>
                <input
                    type='text'
                    className='form-input'
                    {...register('name')}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                    type='email'
                    className='form-input'
                    {...register('email')}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor='username'>Username</label>
                <input
                    type='text'
                    className='form-input'
                    {...register('username')}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input
                    type='password'
                    className='form-input'
                    {...register('password')}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input
                    type='password'
                    className='form-input'
                    {...register('confirmPassword')}
                    required
                />
            </div>
            <button type='submit' className='button' disabled={loading}>
                {loading ? <Spinner /> : 'Register'}
            </button>
        </form>
    )
}

export default RegisterScreen