import React, { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
//import SocialMediaPokemonAPI from "../../database/database";

function LoginContainer() {

    async function login(loginData: any) {
        try {
            //let data = await SocialMediaPokemonAPI.login(loginData);
            // return { success: data.response, token: data.token };
        } catch (errors) {
            return { success: false, errors };
        }
    }

    return (
        <>
            <LoginForm login={login} />
        </>
    );
}

export default LoginContainer;