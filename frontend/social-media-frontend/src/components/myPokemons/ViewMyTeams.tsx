import React, { useState } from 'react'
import Dropdown from 'react-bootstrap/esm/Dropdown'
import DropdownButton from 'react-bootstrap/esm/DropdownButton'
import { AddCreatedPokemonToTeam } from '../../api/myPokemons/myPokemonsAPI'
import Error from '../common/Error'
import { useSelector } from 'react-redux'

const ViewMyTeams = ({ teams, pokemon_index, setMessagePokemon}: any) => {
    const { userToken } = useSelector((state: any) => state.auth)

    const addPokemonToTeam = async (team_name: any) => {
        try {
            const addedPokemon = await AddCreatedPokemonToTeam(userToken, pokemon_index, team_name);
            if (addedPokemon.response) {
                setMessagePokemon(addedPokemon.message);
            }
        } catch (error: any) {
            console.log("error: ", error);
        }
    }

    const listUserTeams = teams.map((team: any, index: any) =>
        <Dropdown.Item onClick={() => addPokemonToTeam(team.team_name)} key={team.team_id}>{team.team_name}</Dropdown.Item>
    );

    return (
        <div>
            {listUserTeams}
        </div>
    )
}

export default ViewMyTeams