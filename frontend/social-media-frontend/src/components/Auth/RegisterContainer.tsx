import React, { useEffect, useState } from "react";
import RegisterForm from "./RegisterForm";
//import SocialMediaPokemonAPI from "../../database/database";

function RegisterContainer() {

    async function register(registerData: any) {
        try {
            // let data = await SocialMediaPokemonAPI.register(registerData);
            // return { success: data.response, data: data };
        } catch (errors) {
            return { success: false, errors };
        }
    }

    return (
        <>
            <RegisterForm register={register} />
        </>
    );
}

export default RegisterContainer;