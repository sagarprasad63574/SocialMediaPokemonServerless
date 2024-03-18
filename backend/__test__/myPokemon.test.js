const myPokemonDAO = require('../repository/myPokemonDAO');
const myPokemonService = require('../service/myPokemonService');
const teamService = require('../service/teamService');
const uuid = require('uuid');

jest.mock('../repository/myPokemonDAO');
jest.mock('../service/teamService');
jest.mock('uuid');

beforeEach(() => {
    jest.clearAllMocks();
})

describe('Creating Pokemon', () => {
    const inPoke = {
        pokemon_name: "testpoke",
        attack: 25,
        defense: 50,
        specialattack: 55,
        specialdefense: 62,
        speed: 20,
        hp: 66
    };
    const in_user_id = "0";
    test('Creating pokemon but passing in empty data, should return false', async () => {
        const data = await myPokemonService.createMyPokemon(in_user_id, {});
        expect(data.response).toBeFalsy();
    });
    test('Creating pokemon with incomplete data, should return false', async () => {
        const incomplete = {
            pokemon_name: inPoke.pokemon_name,
            attack: inPoke.attack,
            defense: inPoke.defense,
            speed: inPoke.speed,
            hp: inPoke.hp
        };
        const data = await myPokemonService.createMyPokemon(in_user_id, incomplete);
        expect(data.response).toBeFalsy();
    });
    test('Creating pokemon with complete data, should return true', async () => {
        myPokemonDAO.ViewMyPokemons.mockResolvedValueOnce([]);
        uuid.v4.mockReturnValueOnce("1");
        myPokemonDAO.createMyPokemon.mockResolvedValueOnce([{...inPoke, 
            type: [
            {
                type: {
                    name: "normal"
                },
                slot: 1
            }
        ],
        moves: []}]);
        const data = await myPokemonService.createMyPokemon(in_user_id, inPoke);
        expect(data.response).toBeTruthy();
    });
});

describe('View Created Pokemon', () => {
    const inPoke0 = {
        pokemon_name: "testpoke",
        attack: 25,
        defense: 50,
        specialattack: 55,
        specialdefense: 62,
        speed: 20,
        hp: 66
    };
    const inPoke1 = {
        pokemon_name: "testpoke1",
        attack: 42,
        defense: 56,
        specialattack: 99,
        specialdefense: 56,
        speed: 50,
        hp: 90
    };
    const in_user_id = "0";
    test('View Created Pokemon but list is empty', async () => {
        myPokemonDAO.ViewMyPokemons.mockResolvedValueOnce([]);
        const data = await myPokemonService.viewMyCreatedPokemons(in_user_id);
        expect(data.response).toBeFalsy();
    });
    test('View Created Pokemon but list has 2 entries, should return true', async () => {
        myPokemonDAO.ViewMyPokemons.mockResolvedValueOnce([inPoke0, inPoke1]);
        const data = await myPokemonService.viewMyCreatedPokemons(in_user_id);
        expect(data.response).toBeTruthy();       
    });
});

describe('Editing Pokemon', () => {
    const inPoke0 = {
        pokemon_name: "testpoke",
        attack: 25,
        defense: 50,
        specialattack: 55,
        specialdefense: 62,
        speed: 20,
        hp: 66
    };
    const inPoke1 = {
        pokemon_name: "testpoke1",
        attack: 42,
        defense: 56,
        specialattack: 99,
        specialdefense: 56,
        speed: 50,
        hp: 90,
    };
    const in_user_id = "0";
    test('Editing Pokemon but received empty data, should return false', async () => {
        const data = await myPokemonService.editMyPokemon(in_user_id, 0, {});
        expect(data.response).toBeFalsy();
    });
    test('Editing Pokemon but received incomplete data, should return false', async () => {
        const incomplete = {
            pokemon_name: inPoke0.pokemon_name,
            attack: inPoke1.attack,
            defense: inPoke0.defense,
            speed: inPoke1.speed,
            hp: inPoke0.hp
        };
        const data = await myPokemonService.editMyPokemon(in_user_id, 0, incomplete);
        expect(data.response).toBeFalsy();
    });
    test('Editing Pokemon but index is out of range, should return false', async () => {
        myPokemonDAO.ViewMyPokemons.mockResolvedValueOnce([]);
        const data = await myPokemonService.editMyPokemon(in_user_id, 0, inPoke1);
        expect(data.response).toBeFalsy();
    });
    test('Editing Pokemon but index is still out of range, should return false', async () => {
        myPokemonDAO.ViewMyPokemons.mockResolvedValueOnce([inPoke0]);
        const data = await myPokemonService.editMyPokemon(in_user_id, 1, inPoke1);
        expect(data.response).toBeFalsy();
    });
    test('Editing Pokemon but name is a duplicate, should return false', async () => {
        myPokemonDAO.ViewMyPokemons.mockResolvedValue([inPoke0]);
        const data = await myPokemonService.editMyPokemon(in_user_id, 0, inPoke0);
        expect(data.response).toBeFalsy();
    });
    test('Editing Pokemon and name is unique, should return true', async () => {
        myPokemonDAO.ViewMyPokemons.mockResolvedValue([inPoke0]);
        myPokemonDAO.editMyPokemon.mockResolvedValue(inPoke1);
        const data = await myPokemonService.editMyPokemon(in_user_id, 0, inPoke1);
        expect(data.response).toBeTruthy();
    });
});

describe('Adding Pokemon to Team', () => {
    const emptyTeam = {
        team_id : "4",
        team_name: "testteam",
        win: 0,
        loss: 0,
        points: 0,
        post: true,
        pokemons: [],
        battlelog: []
    };
    const inPoke = {
        pokemon_id: "2",
        pokemon_name: "testpoke",
        attack: 25,
        defense: 50,
        specialattack: 55,
        specialdefense: 62,
        speed: 20,
        hp: 66,
        type: [
            {
                type: {
                    name: "normal"
                },
                slot: 1
            }
        ],
        moves: []
    };
    const in_user_id = "0";
    test('Adding Pokemon but data is empty, should return false', async () => {
        const data = await myPokemonService.addPokemonToTeam(in_user_id, inPoke.pokemon_id, {});
        expect(data.response).toBeFalsy();
    });
    test('Adding Pokemon but teams do not exist', async () => {
        teamService.viewMyTeams.mockResolvedValueOnce({response: false, message: "No teams found!"});
        const data = await myPokemonService.addPokemonToTeam(in_user_id, "2", {team_name: emptyTeam.team_name});
        expect(data.response).toBeFalsy();
    });
    test('Adding Pokemon but pokemon id does not corresponse, should return false', async () => {
        teamService.viewMyTeams.mockResolvedValueOnce({response: true, message: "My teams", teams: [emptyTeam]});
        myPokemonDAO.ViewMyPokemons.mockResolvedValueOnce([]);
        const data = await myPokemonService.addPokemonToTeam(in_user_id, "3", {team_name: emptyTeam.team_name});
        expect(data.response).toBeFalsy();
    });
    test('Adding Pokemon but team could not be found, should return false', async () => {
        teamService.viewMyTeams.mockResolvedValueOnce({response: true, message: "My teams", teams: [emptyTeam]});
        myPokemonDAO.ViewMyPokemons.mockResolvedValueOnce([inPoke]);
        teamService.viewTeamById.mockResolvedValueOnce({response: false, message: `No team found with id ${emptyTeam.team_id}`})
        const data = await myPokemonService.addPokemonToTeam(in_user_id, 0, {team_name: emptyTeam.team_name});
        expect(data.response).toBeFalsy();
    });
    test('Adding Pokemon and team could be found, should return true', async () => {
        teamService.viewMyTeams.mockResolvedValueOnce({response: true, message: "My teams", teams: [emptyTeam]});
        myPokemonDAO.ViewMyPokemons.mockResolvedValueOnce([inPoke]);
        teamService.viewTeamById.mockResolvedValueOnce({response: true, team: emptyTeam});
        teamService.viewTeamByName.mockResolvedValue({response: true, team: [emptyTeam]});
        teamService.findTeamIndexToAddPokemon.mockReturnValue(0);
        myPokemonDAO.addPokemonToTeam.mockResolvedValueOnce(inPoke);
        const data = await myPokemonService.addPokemonToTeam(in_user_id, 0, {team_name: emptyTeam.team_name});
        expect(data.response).toBeTruthy();
    });
});

describe('Deleting Pokemon', () => {
    const inPoke = {
        pokemon_id: "2",
        pokemon_name: "testpoke",
        attack: 25,
        defense: 50,
        specialattack: 55,
        specialdefense: 62,
        speed: 20,
        hp: 66,
        type: [
            {
                type: {
                    name: "normal"
                },
                slot: 1
            }
        ],
        moves: []
    };
    const in_user_id = "0";
    test('Deleting Pokemon but no pokemon present, should return false', async () => {
        myPokemonDAO.ViewMyPokemons.mockResolvedValueOnce([]);
        const data = await myPokemonService.deleteMyPokemon(in_user_id, 0);
        expect(data.response).toBeFalsy();
    });
    test('Deleting Pokemon but pokemon exists, should return true', async () => {
        myPokemonDAO.ViewMyPokemons.mockResolvedValueOnce([inPoke]);
        myPokemonDAO.deleteMyPokemon.mockResolvedValueOnce(true);
        const data = await myPokemonService.deleteMyPokemon(in_user_id, 0);
        expect(data.response).toBeTruthy();
    });
});