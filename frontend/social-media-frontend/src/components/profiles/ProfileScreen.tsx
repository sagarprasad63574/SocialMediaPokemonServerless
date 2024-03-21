import { useSelector } from 'react-redux'
import ProfileContainer from './ProfileContainer'
//import '../styles/profile.css'

const ProfileScreen = () => {
    const { userInfo } = useSelector((state: any) => state.auth)
    return (
        <div>
            <h3 style={{padding: '10px'}}>Welcome {userInfo?.username}!</h3>
            <ProfileContainer />
        </div>
    )
}

export default ProfileScreen