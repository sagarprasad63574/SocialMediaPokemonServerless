import React, { useState } from 'react'
import Dropdown from 'react-bootstrap/esm/Dropdown'
import DropdownButton from 'react-bootstrap/esm/DropdownButton'
import { AddCreatedPokemonToTeam } from '../../api/myPokemons/myPokemonsAPI'
import Error from '../common/Error'
import { useSelector } from 'react-redux'
import { AddPokemonToTeam } from '../../api/pokemon/pokemonAPI'

const ViewMyTeams = ({ teams, pokemon_name, setMessagePokemon, setResponse }: any) => {
    const { userToken } = useSelector((state: any) => state.auth)

    const addPokemonToTeam = async (team_name: any) => {
        try {
            const addedPokemon = await AddPokemonToTeam(userToken, pokemon_name, team_name);
            setMessagePokemon(addedPokemon.message)
            setResponse(false)
            if (addedPokemon.response) {
                setResponse(true);
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