import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin } from '../../store/actions/authActions'
import { useEffect, useState } from 'react'
import Error from '../common/Error'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'
import Container from 'react-bootstrap/esm/Container'

const LoginScreen = () => {
    const { userInfo, error } = useSelector((state: any) => state.auth)
    const dispatch = useDispatch()

    const [data, setData] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate()

    useEffect(() => {
        if (userInfo) {
            navigate('/profile')
        }
    }, [navigate, userInfo])

    const handleSubmit = (event: any) => {
        event.preventDefault();
        dispatch(userLogin(data))
    }

    return (
        <Container className="d-grid justify-content-center">
            <h1>WELCOME LOGIN</h1>
            <Form onSubmit={handleSubmit}>
                {error && <Error>{error}</Error>}
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" required
                        onChange={(event) => setData({ ...data, username: event.target.value })} />
                </Form.Group>

                <Form.Group className="center mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required
                        onChange={(event) => setData({ ...data, password: event.target.value })} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    )
}

export default LoginScreen