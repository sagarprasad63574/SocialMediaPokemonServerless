import React from 'react'

const ViewProfile = (props: any) => {
    const {visible, setVisible, profile} = props;
    const handleEdit = (event: any) => {
        setVisible(!visible);
    };
    return (
        <div>
            <span>Name : {profile.name}</span> <br/>
            <span>Email : {profile.email}</span> <br/>
            <span>Biography : {profile.biography}</span> <br/>
            <button onClick={handleEdit}>Edit Profile</button>
        </div>
    )
};

export default ViewProfile