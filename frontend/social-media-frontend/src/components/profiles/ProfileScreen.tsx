import { useSelector } from 'react-redux'
import ProfileContainer from './ProfileContainer'
//import '../styles/profile.css'

const ProfileScreen = () => {
    const { userInfo } = useSelector((state: any) => state.auth)
    return (
        <div>
            <figure>{userInfo?.username.toUpperCase()}</figure>
            <span>
                Welcome <strong>{userInfo?.username}!</strong> You can view this page
                because you're logged in
            </span>
            <ProfileContainer />
        </div>
    )
}

export default ProfileScreen