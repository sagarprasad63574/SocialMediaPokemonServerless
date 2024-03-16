import { render, screen } from '@testing-library/react';
import ViewAllPostedTeams from './ViewAllPostedTeams';
import ViewPokemon from './ViewPokemon';
import ViewUsersTeams from './ViewUsersTeams';

describe('ViewAllPostedTeams', () => {
    /*
    {
            "user_id": "edb17c04-f59f-4e9b-9cd2-08d0fb5e54f2",
            "name": "jerry smith",
            "username": "Freddytt",
            "teams": [
                {
                    "pokemons": [
                        {
                            "defense": 78,
                            "attack": 84,
                            "hp": 78,
                            "specialattack": 109,
                            "specialdefense": 85,
                            "pokemon_name": "charizard",
                            "type": [
                                {
                                    "type": {
                                        "name": "fire",
                                        "url": "https://pokeapi.co/api/v2/type/10/"
                                    },
                                    "slot": 1
                                },
                                {
                                    "type": {
                                        "name": "flying",
                                        "url": "https://pokeapi.co/api/v2/type/3/"
                                    },
                                    "slot": 2
                                }
                            ],
                            "speed": 100
                        }
                    ],
                    "loss": 0,
                    "post": true,
                    "battlelog": [],
                    "team_id": "e89cac93-732a-4953-bbb7-d29e16453605",
                    "win": 0,
                    "team_name": "newer",
                    "points": 0
                }
            ]
        }
    */
    const foundTeams = [{
        user_id: "etrhwdbwsah",
        name: "John Doe",
        username: "testuser",
        teams: []
    }];
    render(<ViewAllPostedTeams postedTeams={foundTeams}/>);
    const elem = screen.getByText(foundTeams[0].username);
    expect(elem).toBeInTheDocument();
});
describe('ViewPokemon', () => {

});
describe('ViewUsersTeams', () => {

});
