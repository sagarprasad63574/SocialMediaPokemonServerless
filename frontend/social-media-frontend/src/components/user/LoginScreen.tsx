import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin } from '../../store/actions/authActions'
import { useEffect } from 'react'
import Error from '../common/Error'
import Spinner from '../common/Spinner'

const LoginScreen = () => {
    const { loading, userInfo, error } = useSelector((state: any) => state.auth)
    const dispatch = useDispatch()

    const { register, handleSubmit } = useForm()

    const navigate = useNavigate()

    // redirect authenticated user to profile screen
    useEffect(() => {
        if (userInfo) {
            navigate('/')
        }
    }, [navigate, userInfo])

    const submitForm = (data: any) => {
        dispatch(userLogin(data))
    }

    return (
        <form onSubmit={handleSubmit(submitForm)}>
            {error && <Error>{error}</Error>}
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
            <button type='submit' className='button' disabled={loading}>
                {loading ? <Spinner /> : 'Login'}
            </button>
        </form>
    )
}

export default LoginScreen