const pokemonService = require('../service/pokemonService');
const pokemonDAO = require('../repository/pokemonDAO');
const teamDAO = require('../repository/teamDAO');
const axios = require('axios');
const uuid = require('uuid');

jest.mock('../repository/teamDAO');
jest.mock('../repository/pokemonDAO');
jest.mock('uuid');

describe('pokemon Test', () => {
    test('Empty data, should return false', async () => {
        const data = await pokemonService.getPokemon(0,{});
        expect(data.response).toBeFalsy();
    });
    test('Mispelled pokemon name should return false', async () => {
        const data = await pokemonService.getPokemon(0,"piiiiiikaaaaachuuuuuuuuu");
        expect(data.response).toBeFalsy();
    });
    test('Correctly spelled pokemon name should return true', async () => {
        pokemonDAO.pokedata.mockResolvedValueOnce("pikachu");
        const data = await pokemonService.getPokemon(0,"pikachu");
        expect(data.response).toBeTruthy();
    });
    test('Test add pokemon to team', async () => {
        const team = {
            team_id: "1",
            team_name: "testeam",
            win: 0,
            loss: 0,
            points: 0,
            pokemons: [],
            battlelog: []
        };
        const pokemon = {
            team_name: "testeam",
            pokemon_name: "charizard"
        };
        let pokemondata;
        try
        {
            const url = `https://pokeapi.co/api/v2/pokemon/charizard/`;
            pokemondata = await axios.get(url);
        }
        catch (error) {
        }
        teamDAO.ViewUsersTeams.mockResolvedValueOnce([team]);
        pokemonDAO.pokedata.mockResolvedValueOnce(pokemondata);
        pokemonDAO.addPokemonToTeam.mockResolvedValueOnce([pokemon]);
        uuid.v4.mockReturnValueOnce("1");
        const data = await pokemonService.addPokemonToTeam(1,pokemon);
        expect(data.response).toBeTruthy();
    });
    test('Test delete pokemon', async () => {
        const team = {
            team_id: "1",
            team_name: "testeam",
            win: 0,
            loss: 0,
            points: 0,
            pokemons: [],
            battlelog: []
        };
        teamDAO.ViewUsersTeams.mockResolvedValueOnce([team]);
        pokemonDAO.deletePokemonFromTeam.mockResolvedValueOnce(1);
        const data = await pokemonService.deletePokemonFromTeam(1,0,0);
        expect(data.response).toBeTruthy();
    });
    test('Test edit pokemon', async () => {
        const team = {
            team_id: "1",
            team_name: "testeam",
            win: 0,
            loss: 0,
            points: 0,
            pokemons: [],
            battlelog: []
        };
        const pokemon = {
            pokemon_name: "bob",
            attack: 1,
            defense: 1,
            specialattack: 1,
            specialdefense: 1,
            speed: 1,
            hp: 1
        };
        teamDAO.ViewUsersTeams.mockResolvedValueOnce([team]);
        pokemonDAO.editPokemonFromTeam.mockResolvedValueOnce(1);
        const data = await pokemonService.editPokemonFromTeam(1,0,0,pokemon);
        expect(data.response).toBeTruthy();
    });
});