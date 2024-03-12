import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { useGetUserDetailsQuery } from '../../services/auth/authService'
import { logout, setCredentials } from '../../features/auth/authSlice'
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
                        <NavLink className='button' to='/login'>
                            Login
                        </NavLink>
                    )}
                </div>
            </div>
            <nav className='container navigation'>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/login'>Login</NavLink>
                <NavLink to='/register'>Register</NavLink>
                <NavLink to='/profile'>Profile</NavLink>
                <NavLink to='/teams'>Teams</NavLink>
            </nav>
        </header>
    )
}

export default Header