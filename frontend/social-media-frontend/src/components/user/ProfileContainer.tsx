import React from 'react';
import { useSelector } from 'react-redux';
const ProfileContainer = () => {
    const userInfo = useSelector((state: any) => state.auth);
    const [profile, setProfile] = React.useState({});
    const [showForm, setShowForm] = React.useState(false);
    return (
        <></>
    );
};
export default ProfileContainer;