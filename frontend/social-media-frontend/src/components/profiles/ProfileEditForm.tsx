import React from "react";
import { editProfile } from "../../api/profiles/profileAPI";
import { useSelector } from "react-redux";

const ProfileEditForm = (props: any) => {
    const {profile, setProfile, visible, setVisible} = props;
    const {userToken} = useSelector((state: any) => state.auth);
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const elems = event.target;
        const newBio = {
            name: elems[0].value,
            email: elems[1].value,
            biography: elems[2].value
        };
        try {
            let data = await editProfile(userToken, newBio);
            console.log(data);
            setProfile(newBio);
            setVisible(!visible);
        } catch (error) {
            console.log("ERROR HERE: ", error);
        }
    };
    const handleRevert = (event: any) => {
        event.preventDefault();
        setVisible(!visible);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" className="form-input" required placeholder={profile.name}/><br/>
            <label htmlFor="email">Email</label>
            <input type="text" className="form-input" required placeholder={profile.email}/><br/>
            <label htmlFor="biography">Biography</label>
            <textarea className="form-input" required placeholder={profile.biography}/><br/>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
            <button onClick={handleRevert}>Revert</button>
        </form>
    );
};

export default ProfileEditForm;