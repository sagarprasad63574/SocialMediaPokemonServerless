import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProfile } from "../../api/profiles/profileAPI";
import Error from '../common/Error';
import ProfileEditForm from "./ProfileEditForm";
import ViewProfile from "./ViewProfile";

const ProfileContainer = () => {
    const {userToken, error} = useSelector((state: any) => state.auth);
    const [profile, setProfile] = useState({});
    const [showForm, setShowForm] = useState(false);
    useEffect(() => {
        async function myProfile(){
            try {
                let found = await getProfile(userToken);
                if(found.user){
                    setProfile({
                        name: found.user.name,
                        email: found.user.email,
                        biography: found.user.biography
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
        myProfile();
    }, [userToken]);
    return (
        <div>
            {error && <Error>{error}</Error>}
            {showForm ? (
                <ProfileEditForm visible={showForm} setVisible={setShowForm}/>
            ) : (
                <ViewProfile profile={profile} visible={showForm} setVisible={setShowForm}/>
            )}
        </div>
    );
};

export default ProfileContainer;