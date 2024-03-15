import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Error from '../common/Error'
import Spinner from '../common/Spinner'
import { registerUser } from '../../store/actions/authActions'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'

const RegisterScreen = () => {
    const [customError, setCustomError] = useState("")

    const { loading, userInfo, error, success } = useSelector(
        (state: any) => state.auth
    )

    const [data, setData] = useState({
        name: "",
        username: "",
        password: "",
        email: "",
        confirmPassword: ""
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const { register, handleSubmit } = useForm()


    useEffect(() => {
        // redirect authenticated user to profile screen
        if (userInfo) navigate('/profile')
        // redirect user to login page if registration was successful
        if (success) navigate('/login')
    }, [navigate, userInfo, success])

    const handleSubmit = (event: any) => {
        event.preventDefault()

        if (data.password !== data.confirmPassword) {
            setCustomError('Password mismatch')
            return
        }
        data.email = data.email.toLowerCase()

        dispatch(registerUser(data))
    }

    return (

        
        <Container className="d-grid justify-content-lg-center">
            <h1>REGISTER USER</h1>
            <Form onSubmit={handleSubmit}>
                {error && <Error>{error}</Error>}
                {customError && <Error>{customError}</Error>}
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" required
                        onChange={(event) => setData({ ...data, name: event.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" required
                        onChange={(event) => setData({ ...data, email: event.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" required
                        onChange={(event) => setData({ ...data, username: event.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required
                        onChange={(event) => setData({ ...data, password: event.target.value })} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" required
                        onChange={(event) => setData({ ...data, confirmPassword: event.target.value })} />
                </Form.Group>
                
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>

        // <form onSubmit={handleSubmit(submitForm)}>
        //     {error && <Error>{error}</Error>}
        //     {customError && <Error>{customError}</Error>}
        //     <div className='form-group'>
        //         <label htmlFor='name'>Name</label>
        //         <input
        //             type='text'
        //             className='form-input'
        //             {...register('name')}
        //             required
        //         />
        //     </div>
        //     <div className='form-group'>
        //         <label htmlFor='email'>Email</label>
        //         <input
        //             type='email'
        //             className='form-input'
        //             {...register('email')}
        //             required
        //         />
        //     </div>
        //     <div className='form-group'>
        //         <label htmlFor='username'>Username</label>
        //         <input
        //             type='text'
        //             className='form-input'
        //             {...register('username')}
        //             required
        //         />
        //     </div>
        //     <div className='form-group'>
        //         <label htmlFor='password'>Password</label>
        //         <input
        //             type='password'
        //             className='form-input'
        //             {...register('password')}
        //             required
        //         />
        //     </div>
        //     <div className='form-group'>
        //         <label htmlFor='confirmPassword'>Confirm Password</label>
        //         <input
        //             type='password'
        //             className='form-input'
        //             {...register('confirmPassword')}
        //             required
        //         />
        //     </div>
        //     <button type='submit' className='button' disabled={loading}>
        //         {loading ? <Spinner /> : 'Register'}
        //     </button>
        // </form>
    )
}

export default RegisterScreen