const battle = require('../service/battleSim');

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

    test('Charizard VS Blastoise', async () => {
        const result = battle.battleSim([charizard],[blastoise]);
        //resetting hp bc i dont want to make another object
        charizard.hp = 78;
        blastoise.hp = 79;
        expect(result).toBe(2);
    });

    test('Blastoise VS Charizard', async () => {
        const result = battle.battleSim([blastoise],[charizard]);
        charizard.hp = 78;
        blastoise.hp = 79;
        expect(result).toBe(1);
    });

    test('Blastoise VS Charizard, Charizard', async () => {
        const result = battle.battleSim([blastoise],[charizard, venusaur]);
        charizard.hp = 78;
        blastoise.hp = 79;
        venusaur.hp = 80;
        expect(result).toBe(2);
    });
});