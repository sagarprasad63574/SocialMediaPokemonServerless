import { useSelector } from 'react-redux'
import ProfileContainer from './ProfileContainer'
//import '../styles/profile.css'

const ProfileScreen = () => {
    const { userInfo } = useSelector((state: any) => state.auth)
    return (
        <div>
            <h2 style={{padding: '10px'}}>Welcome {userInfo?.username}! You can see this because you are now logged in!</h2>
            <ProfileContainer />
        </div>
    )
}

export default ProfileScreen