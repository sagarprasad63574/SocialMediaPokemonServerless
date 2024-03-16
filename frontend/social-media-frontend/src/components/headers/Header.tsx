import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { useGetUserDetailsQuery } from '../../store/middleware/authService'
import { logout, setCredentials } from '../../store/slices/authSlice'
import { Button, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
//import '../styles/header.css'

const Header = () => {
    const { userInfo } = useSelector((state: any) => state.auth)
    const dispatch = useDispatch()
    console.log("At headers", userInfo)
    // automatically authenticate user if token is found
    const { data, isFetching } = useGetUserDetailsQuery('userDetails', {
        pollingInterval: 900000, // 15mins
    })

    useEffect(() => {
        if (data) dispatch(setCredentials(data))
    }, [data, dispatch])

    return (
        <header>
            <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand as={Link} to="/">Social Media Pokemon</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to='/profile'>Profile</Nav.Link>
                            <Nav.Link as={Link} to='/search'>Search</Nav.Link>
                            <Nav.Link as={Link} to='/teams'>Teams</Nav.Link>
                            <Nav.Link as={Link} to='/comments'>Comments</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <div className='header-status'>
                        <span>
                            {isFetching
                                ? `Fetching your profile...`
                                : userInfo !== null
                                    ? <span style={{ color: "white" }}>{` Logged in as ${userInfo.username} `}</span>
                                    : <span style={{ color: "white" }}> You're not logged in </span>}
                            {userInfo ? (
                                <Button variant="outline-light" size="sm" onClick={() => dispatch(logout())}>
                                    Logout
                                </Button>
                            ) : (
                                <span>
                                    <Link to="/login">
                                        <Button variant="outline-light" size="sm" className='mr-5'>
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button variant="outline-light" size="sm">
                                            Register
                                        </Button>
                                    </Link>
                                </span>
                            )}
                        </span>

                    </div>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header