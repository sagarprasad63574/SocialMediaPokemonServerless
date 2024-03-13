import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { useGetUserDetailsQuery } from '../../store/middleware/authService'
import { logout, setCredentials } from '../../store/slices/authSlice'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
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
            <div className='header-status'>
                <span>
                    {isFetching
                        ? `Fetching your profile...`
                        : userInfo !== null
                            ? `Logged in as ${userInfo.username}`
                            : "You're not logged in"}
                </span>
                <div className='cta'>
                    {userInfo ? (
                        <button className='button' onClick={() => dispatch(logout())}>
                            Logout
                        </button>
                    ) : (
                        <Nav.Link className='button' href='/login'>
                            Login
                        </Nav.Link>
                    )}
                </div>
            </div>

            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">Social Media Pokemon</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/login">Login</Nav.Link>
                            <Nav.Link href='/register'>Register</Nav.Link>
                            <Nav.Link href='/profile'>Profile</Nav.Link>
                            <Nav.Link href='/teams'>Teams</Nav.Link>
                            <Nav.Link href='/teams/add'>AddTeam</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header