import React from "react";

const ProfileEditForm = (props: any) => {
    const handleSubmit = (event: any) => {

    };
    const handleRevert = (event: any) => {
        event.preventDefault();
        console.log("reverting");
    };
    
    return (
        <form>
            <label></label>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
            <button onClick={handleRevert}>Revert</button>
        </form>
    );
};

export default ProfileEditForm;