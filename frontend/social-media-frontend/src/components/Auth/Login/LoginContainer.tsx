import React, { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import SocialMediaPokemonAPI from "../../../database/database";

function LoginContainer() {
    // const [user, setUser] = useState({} as any);

    // async function updateUser(user: any) {
    //     try {
    //         let response: any = await getUser(user);
    //         setUser(response.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // async function getUser(user: any) {
    //     try {
    //         let response = await axios.post(`${URL}/user`, {
    //             username: user.username,
    //             password: user.password,
    //         });

    //         return response;
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    async function login(loginData: any) {
        try {
            let data = await SocialMediaPokemonAPI.login(loginData);
            console.log(data);
            return { success: data.response, token: data.token };
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