import { render, screen } from "@testing-library/react"
import {BrowserRouter} from "react-router-dom";
import store from "../../store/store";
import {Provider} from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import BattleSimulatorContainer from "./BattleSimulatorContainer";
import SetUpTeams from "./SetUpTeams";
import ConductFightSequence from "./ConductFightSequence";

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

const teams = [{
    user_id: "edb17c04-f59f-4e9b-9cd2-08d0fb5e54f2",
    name: "jerry smith",
    username: "Freddytt",
    teams: [
        {
            pokemons: [],
            loss: 0,
            post: true,
            battlelog: [],
            team_id: "e89cac93-732a-4953-bbb7-d29e16453605",
            win: 0,
            team_name: "newer",
            points: 0
        }
    ]
},
{
    "user_id": "02406bfd-75af-4145-9855-be41027100c3",
    "name": "Randy Savage",
    "username": "testuser",
    "teams": [
        {
            "pokemons": [],
            "loss": 0,
            "post": true,
            "battlelog": [],
            "team_id": "4261c07b-322d-4ea1-932f-8935cf71d3e9",
            "win": 0,
            "team_name": "team1",
            "points": 0
        },
        {
            "pokemons": [],
            "loss": 0,
            "post": true,
            "battlelog": [],
            "team_id": "b7d922f8-9693-4f98-8740-e7c6e4d89b99",
            "win": 0,
            "team_name": "team2",
            "points": 0
        }
    ]
}];

const myTeams = [{
    battlelog: [],
    loss: 0,
    points: 0,
    pokemons: [
        {
            defense: 90,
            attack: 80,
            moves: [],
            pokemon_id: "6ad03b37-a89c-4c8b-be97-2af8a55fada6",
            specialattack: 50,
            hp: 99,
            sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
            specialdefense: 60,
            pokemon_name: "tentaquil",
            type: [
                {
                    type: {
                        name: "normal"
                    },
                    slot: 1
                }
            ],
            speed: 80,
            mypokemon: true
        }
    ],
    post: true,
    team_id: "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
    team_name: "test_team",
    win: 0
}];

describe('Battle Simulator Container', () => {
    test('Should render basic container', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<BattleSimulatorContainer />);
        const battleHeader = screen.getByText("Battle Simulator");
        expect(battleHeader).toBeInTheDocument();
    });
});

describe('Set Up Teams', () => {
    test('Should render fight prep', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<SetUpTeams postedTeams={teams} myTeams={myTeams} selectedOpponentTeam={teams[0].teams[0]} yourTeam={teams[0].teams[0]} />);
        const opponentHeader = screen.getByText("Opponent Teams");
        const yourHeader = screen.getByText("Your Teams");
        expect(opponentHeader).toBeInTheDocument();
        expect(yourHeader).toBeInTheDocument();
    })
});

describe('Conduct Fight Sequence', () => {
    test('Should render empty battle', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ConductFightSequence user_team_name={myTeams[0].team_name} opponent_team_name={teams[0].teams[0].team_name} battleResult={{summary: [], details: [], message: "Tie"}} />);
        const battleHeader = screen.getByText("BATTLE");
        const userTeamHeader = screen.getByText(`User Team Name: ${myTeams[0].team_name}`);
        const opponentTeamHeader = screen.getByText(`Opponent Team Name: ${teams[0].teams[0].team_name}`);
        const messageHeader = screen.getByText("Message: Tie");
        expect(battleHeader).toBeInTheDocument();
        expect(userTeamHeader).toBeInTheDocument();
        expect(opponentTeamHeader).toBeInTheDocument();
        expect(messageHeader).toBeInTheDocument(); 
    });
});

function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}