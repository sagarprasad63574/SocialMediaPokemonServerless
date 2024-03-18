const battle = require('../service/battleSim');
const teamDAO = require('../repository/teamDAO');
const battleDAO = require('../repository/battleSimDAO');

jest.mock('../repository/teamDAO');
jest.mock('../repository/battleSimDAO');

describe('basic simulation between 2 pokemon', () => {

    const blastoise = {
        attack: 83,
        defense: 100,
        hp: 79,
        moves: [
            {
                accuracy: 100,
                power: 65,
                type: "water",
                move_name: "bubble-beam",
                info: {
                    healing: 0,
                    min_hits: null,
                    max_hits: null,
                    ailment_chance: 0,
                    crit_rate: 0,
                    flinch_chance: 0,
                    min_turns: null,
                    ailment: {
                        name: "none",
                        url: "https://pokeapi.co/api/v2/move-ailment/0/"
                    },
                    category: {
                        name: "damage+lower",
                        url: "https://pokeapi.co/api/v2/move-category/6/"
                    },
                    max_turns: null,
                    drain: 0,
                    stat_chance: 10
                }
            },
            {
                accuracy: 100,
                power: 40,
                type: "normal",
                move_name: "tackle",
                info: {
                    healing: 0,
                    min_hits: null,
                    max_hits: null,
                    ailment_chance: 0,
                    crit_rate: 0,
                    flinch_chance: 0,
                    min_turns: null,
                    ailment: {
                        name: "none",
                        url: "https://pokeapi.co/api/v2/move-ailment/0/"
                    },
                    category: {
                        name: "damage",
                        url: "https://pokeapi.co/api/v2/move-category/0/"
                    },
                    max_turns: null,
                    drain: 0,
                    stat_chance: 0
                }
            }
        ],
        pokemon_name: "blastoise",
        specialattack: 85,
        specialdefense: 105,
        speed: 78,
        type: [
            {
                type: {
                    name: "water",
                    url: "https://pokeapi.co/api/v2/type/11/"
                },
                slot: 1
            }
        ]
    };

    const charizard = {
        attack: 84,
        defense: 78,
        hp: 78,
        moves: [
            {
                accuracy: 100,
                power: 40,
                type: "fire",
                move_name: "ember",
                info: {
                    healing: 0,
                    min_hits: null,
                    max_hits: null,
                    ailment_chance: 10,
                    crit_rate: 0,
                    flinch_chance: 0,
                    min_turns: null,
                    ailment: {
                        name: "burn",
                        url: "https://pokeapi.co/api/v2/move-ailment/4/"
                    },
                    category: {
                        name: "damage+ailment",
                        url: "https://pokeapi.co/api/v2/move-category/4/"
                    },
                    max_turns: null,
                    drain: 0,
                    stat_chance: 0
                }
            },
            {
                accuracy: 100,
                power: 40,
                type: "normal",
                move_name: "scratch",
                info: {
                    healing: 0,
                    min_hits: null,
                    max_hits: null,
                    ailment_chance: 0,
                    crit_rate: 0,
                    flinch_chance: 0,
                    min_turns: null,
                    ailment: {
                        name: "none",
                        url: "https://pokeapi.co/api/v2/move-ailment/0/"
                    },
                    category: {
                        name: "damage",
                        url: "https://pokeapi.co/api/v2/move-category/0/"
                    },
                    max_turns: null,
                    drain: 0,
                    stat_chance: 0
                }
            }
        ],
        pokemon_name: "charizard",
        specialattack: 109,
        specialdefense: 85,
        speed: 100,
        type: [
            {
                type: {
                    name: "fire",
                    url: "https://pokeapi.co/api/v2/type/10/"
                },
                slot: 1
            },
            {
                type: {
                    name: "flying",
                    url: "https://pokeapi.co/api/v2/type/3/"
                },
                slot: 2
            }
        ]
    };

    const venusaur = {    
        attack: 82,
        defense: 83,
        hp: 80,
        moves: [
            {
                accuracy: 95,
                power: 55,
                type: "grass",
                move_name: "razor-leaf",
                info: {
                    healing: 0,
                    min_hits: null,
                    max_hits: null,
                    ailment_chance: 0,
                    crit_rate: 1,
                    flinch_chance: 0,
                    min_turns: null,
                    ailment: {
                        "name": "none",
                        "url": "https://pokeapi.co/api/v2/move-ailment/0/"
                    },
                    category: {
                        "name": "damage",
                        "url": "https://pokeapi.co/api/v2/move-category/0/"
                    },
                    max_turns: null,
                    drain: 0,
                    stat_chance: 0
                }
            },
            {
                accuracy: 100,
                power: 90,
                type: "poison",
                move_name: "sludge-bomb",
                info: {
                    healing: 0,
                    min_hits: null,
                    max_hits: null,
                    ailment_chance: 30,
                    crit_rate: 0,
                    flinch_chance: 0,
                    min_turns: null,
                    ailment: {
                        name: "poison",
                        url: "https://pokeapi.co/api/v2/move-ailment/5/"
                    },
                    category: {
                        name: "damage+ailment",
                        url: "https://pokeapi.co/api/v2/move-category/4/"
                    },
                    max_turns: null,
                    drain: 0,
                    stat_chance: 0
                }
            }
        ],
        pokemon_name: "venusaur",
        specialattack: 100,
        specialdefense: 100,
        speed: 80,
        type: [
            {
                type: {
                    name: "grass",
                    url: "https://pokeapi.co/api/v2/type/12/"
                },
                slot: 1
            },
            {
                type: {
                    name: "poison",
                    url: "https://pokeapi.co/api/v2/type/4/"
                },
                slot: 2
            }
        ]
    }

    const nomove = {    
        attack: 82,
        defense: 83,
        hp: 80,
        moves: [
        ],
        pokemon_name: "venusaur",
        specialattack: 100,
        specialdefense: 100,
        speed: 80,
        type: [
            {
                type: {
                    name: "grass",
                    url: "https://pokeapi.co/api/v2/type/12/"
                },
                slot: 1
            },
            {
                type: {
                    name: "poison",
                    url: "https://pokeapi.co/api/v2/type/4/"
                },
                slot: 2
            }
        ]
    }

    let team1 = {
        "team_id": "1",
        "team_name": "team",
        "win": 0,
        "loss": 0,
        "points": 0,
        "pokemons": [charizard],
        "battlelog": []
    };

    let team2 = {
        "team_id": "1",
        "team_name": "team",
        "win": 0,
        "loss": 0,
        "points": 0,
        "pokemons": [blastoise],
        "battlelog": []
    };

    const recieved = {
        "user_team_name": "team",
        "opponent_id": "1",
        "opponent_team_name": "team"
    }
    test('Charizard VS Blastoise', async () => {
        teamDAO.ViewUsersTeams.mockResolvedValueOnce([team1]);
        teamDAO.ViewUsersTeams.mockResolvedValueOnce([team2]);
        battleDAO.addBattleReport.mockResolvedValueOnce([team1]);
        battleDAO.addBattleReport.mockResolvedValueOnce([team2]);
        const result = await battle.battleSim(0,recieved);
        expect(result).toBeTruthy();
    });

    let team3 = {
        "team_id": "1",
        "team_name": "team",
        "win": 0,
        "loss": 0,
        "points": 0,
        "pokemons": [blastoise],
        "battlelog": []
    };

    let team4 = {
        "team_id": "1",
        "team_name": "team",
        "win": 0,
        "loss": 0,
        "points": 0,
        "pokemons": [charizard],
        "battlelog": []
    };

    test('Blastoise VS Charizard', async () => {
        teamDAO.ViewUsersTeams.mockResolvedValueOnce([team3]);
        teamDAO.ViewUsersTeams.mockResolvedValueOnce([team4]);
        battleDAO.addBattleReport.mockResolvedValueOnce([team3]);
        battleDAO.addBattleReport.mockResolvedValueOnce([team4]);
        const result = await battle.battleSim(0,recieved);
        expect(result).toBeTruthy();
    });

    let team5 = {
        "team_id": "1",
        "team_name": "team",
        "win": 0,
        "loss": 0,
        "points": 0,
        "pokemons": [nomove],
        "battlelog": []
    };

    let team6 = {
        "team_id": "1",
        "team_name": "team",
        "win": 0,
        "loss": 0,
        "points": 0,
        "pokemons": [charizard],
        "battlelog": []
    };

    test('pokemon without moves on team one', async () => {
        teamDAO.ViewUsersTeams.mockResolvedValueOnce([team5]);
        teamDAO.ViewUsersTeams.mockResolvedValueOnce([team6]);
        const result = await battle.battleSim(0,recieved);
        expect(result.response).toBeFalsy();
    });

    test('pokemon without moves on team one', async () => {
        teamDAO.ViewUsersTeams.mockResolvedValueOnce([team6]);
        teamDAO.ViewUsersTeams.mockResolvedValueOnce([team5]);
        const result = await battle.battleSim(0,recieved);
        expect(result.response).toBeFalsy();
    });
});