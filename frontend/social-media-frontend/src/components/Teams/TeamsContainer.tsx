import React, { useEffect, useState } from "react";
// import SocialMediaPokemonAPI from "../../database/database";
import TeamsForm from './TeamsForm'

function TeamsContainer() {

    async function userTeams() {
        try {
            // let data = await SocialMediaPokemonAPI.getAllUsersTeams();
            // console.log(data);
            // return { success: data.response, token: data.token };
        } catch (errors) {
            return { success: false, errors };
        }
    }

    return (
        <>
            <TeamsForm userTeams={userTeams} />
        </>
    );
}

export default TeamsContainer;