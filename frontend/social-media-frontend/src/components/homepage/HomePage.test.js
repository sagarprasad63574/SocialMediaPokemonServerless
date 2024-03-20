import { fireEvent, render, screen } from "@testing-library/react";
import * as reactRedux from "react-redux";
import HomePageController from "./HomePageController";
import ViewAllPostedTeams from "./ViewAllPostedTeams";
import ViewUsersTeams from "./ViewUsersTeams";
import ViewPokemon from "./ViewPokemon";
import { BrowserRouter } from "react-router-dom";
import {Provider} from "react-redux";
import store from '../../store/store';
import LoginScreen from "../user/LoginScreen";
import { setCredentials } from "../../store/slices/authSlice";

const userState = {
    loading: false,
    userInfo: {
        response: true,
        message: "User testuser logged in successfully",
        userToken: "dtnaejnrtsdyf",
        user_id: "0",
        username: "testuser",
        name: "test user",
        role: "user"
    },
    userToken: "dtnaejnrtsdyf",
    error: null,
    success: false
};

const allTeams = [ {
    "user_id": "f2675738-859c-408b-9ab1-cd64a68d288b",
    "name": "Test User",
    "username": "testuser99",
    "teams": [
        {
            "battlelog": [],
            "loss": 0,
            "points": 0,
            "pokemons": [
                {
                    "defense": 90,
                    "attack": 80,
                    "moves": [],
                    "pokemon_id": "6ad03b37-a89c-4c8b-be97-2af8a55fada6",
                    "specialattack": 50,
                    "hp": 99,
                    "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
                    "specialdefense": 60,
                    "pokemon_name": "tentaquil",
                    "type": [
                        {
                            "type": {
                                "name": "normal"
                            },
                            "slot": 1
                        }
                    ],
                    "speed": 80,
                    "mypokemon": true
                }
            ],
            "post": true,
            "team_id": "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
            "team_name": "test_team",
            "win": 0
        }
    ]
}];
const allComments = [{
    "team_id": "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
    "comments": [
        {
            "username": "user100",
            "comments": [
                {
                    "rating": 5,
                    "comment": "new comment",
                    "team_id": "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
                    "timestamp": "2024-03-19T21:14:01.114Z"
                }
            ]
        },
        {
            "username": "user1",
            "comments": [
                {
                    "rating": 4,
                    "comment": "New comment",
                    "team_id": "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
                    "timestamp": "2024-03-19T16:43:23.228Z"
                }
            ]
        },
        {
            "username": "user12",
            "comments": [
                {
                    "rating": 10,
                    "comment": "Comment",
                    "team_id": "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
                    "timestamp": "2024-03-20T00:54:30.780Z"
                }
            ]
        },
        {
            "username": "testuser",
            "comments": [
                {
                    "rating": 4,
                    "comment": "This is a comment.",
                    "team_id": "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
                    "timestamp": "2024-03-19T14:15:03.698Z"
                },
                {
                    "rating": 5,
                    "comment": "This is another comment.",
                    "team_id": "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
                    "timestamp": "2024-03-19T14:15:18.455Z"
                },
                {
                    "rating": 4,
                    "comment": "This is a comment for this team",
                    "team_id": "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
                    "timestamp": "2024-03-19T15:16:47.080Z"
                },
                {
                    "rating": 4,
                    "comment": "This is a comment.",
                    "team_id": "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
                    "timestamp": "2024-03-19T15:19:55.748Z"
                }
            ]
        }
    ]
},
{
    "team_id": "e89cac93-732a-4953-bbb7-d29e16453605",
    "comments": [
        {
            "username": "testuser",
            "comments": [
                {
                    "rating": 5,
                    "comment": "Commenting on this posted team.",
                    "team_id": "e89cac93-732a-4953-bbb7-d29e16453605",
                    "timestamp": "2024-03-19T14:49:08.713Z"
                }
            ]
        }
    ]
}];

describe('Rendering Home Page', () => {
    test('Home Page Loads', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<HomePageController />);
        const headerElem = screen.getByText("Welcome To Social Media Pokemon!");
        expect(headerElem).toBeInTheDocument();
    });
});

describe('View All Posted Teams Renders', () => {
    test('Should get username', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ViewAllPostedTeams postedTeams={allTeams} teamComments={allComments} />);
        const teamHeaderElem = screen.getByText(allTeams[0].username);
        expect(teamHeaderElem).toBeInTheDocument();
    });
});

describe('View User Team', () => {
    test('Should get team name', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ViewUsersTeams userTeams={allTeams[0].teams} index={0} teamComments={allComments} />);
        const teamNameElem = screen.getByText(allTeams[0].teams[0].team_name);
        expect(teamNameElem).toBeInTheDocument();
    });
    test('Should get team buttons', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ViewUsersTeams userTeams={allTeams[0].teams} index={0} teamComments={allComments} />);
        const teamDetailButton = screen.getByText("View Team In Detail");
        const teamBattleButton = screen.getByText("Battle");
        expect(teamDetailButton).toBeInTheDocument();
        expect(teamBattleButton).toBeInTheDocument();
    });
});

describe('View Pokemon', () => {
    test('Should show name of pokemon', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ViewPokemon pokemons={allTeams[0].teams[0].pokemons} />);
        const pokeNameElem = screen.getByText(allTeams[0].teams[0].pokemons[0].pokemon_name.toUpperCase());
        expect(pokeNameElem).toBeInTheDocument();
    });
});

function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}