import { render, screen } from "@testing-library/react"
import {BrowserRouter} from "react-router-dom";
import store from "../../store/store";
import {Provider} from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import TeamScreen from "./AddTeamContainer";
import ViewMyTeams from "./ViewMyTeams";
import EditTeamView from "./EditTeamView";
import DeleteTeamView from "./DeleteTeamView";

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

describe('Add Teams Container', () => {
    test('Should render form', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<TeamScreen userTeams={teams} />);
        const addTeamLabel = screen.getByLabelText("Add New Team");
        const teamNameInput = screen.getByPlaceholderText("Enter team name");
        const submitButton = screen.getByText("Add Team");
        expect(addTeamLabel).toBeInTheDocument();
        expect(teamNameInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });
});

describe('View My Teams', () => {
    test('Should render list', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ViewMyTeams userTeams={teams}/>);
        const teamNameHeaders = screen.getAllByText(teams[0].team_name);
        const addPokemonButton = screen.getByText("Add Pokemon");
        const editNameButtom = screen.getByText("Edit Team Name");
        const deleteTeamButton = screen.getByText("Delete Team");
        expect(teamNameHeaders[0]).toBeInTheDocument();
        expect(teamNameHeaders[1]).toBeInTheDocument();
        expect(addPokemonButton).toBeInTheDocument();
        expect(editNameButtom).toBeInTheDocument();
        expect(deleteTeamButton).toBeInTheDocument();
    });
});

describe('Edit Teams View', () => {
    test('Should render form', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<EditTeamView userTeams={teams} team_index={0} />);
        const nameLabel = screen.getByLabelText("Team Name");
        const nameEnter = screen.getByPlaceholderText("Enter Team Name");
        const submitButton = screen.getByText("Submit");
        expect(nameLabel).toBeInTheDocument();
        expect(nameEnter).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });
});

describe('Delete Team View', () => {
    test('Should Render Alert', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<DeleteTeamView team={teams[0]} userTeams={teams} team_index={0} show={true} />);
        const alertHeading = screen.getByText(`DELETE TEAM: ${teams[0].team_name}`);
        const yesButton = screen.getByText("Yes");
        expect(alertHeading).toBeInTheDocument();
        expect(yesButton).toBeInTheDocument();
    })
});

function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}