import { render, screen } from "@testing-library/react"
import {BrowserRouter} from "react-router-dom";
import store from "../../store/store";
import {Provider} from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import PostedTeamContainer from "./PostedTeamContainer";
import PostedTeamScreen from "./PostedTeamScreen";
import ViewCommentsForTeam from "./ViewCommentsForTeam";
import AddCommentForm from "./AddCommentForm";

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

const teamResponse = {
    response: true,
    message: "Got team with team id d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
    foundTeam: {
        username: "testuser99",
        user_id: "f2675738-859c-408b-9ab1-cd64a68d288b",
        team: {
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
        }
    }
};

const teamComments = [{
    username: "testuser99",
    comments: [
        {
            rating: 5,
            comment: "This is a test comment",
            team_id: "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
            timestamp: "2024-03-20T02:55:27.543Z"
        }
    ]
},
{
    username: "user100",
    comments: [
        {
            rating: 5,
            comment: "new comment",
            team_id: "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
            timestamp: "2024-03-19T21:14:01.114Z"
        }
    ]
}];

describe('Posted Team Container', () => {
    test('Should render heading', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<PostedTeamContainer />);
        const commentHeader = screen.getByText("View Comments");
        expect(commentHeader).toBeInTheDocument();
    });
});

describe('Posted Team Screen', () => {
    test('Should render screen', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<PostedTeamScreen postedTeam={teamResponse} />);
        const teamHeader = screen.getByText(`TEAM ${teamResponse.foundTeam.team.team_name.toUpperCase()}`);
        const postedHeader = screen.getByText(`Posted by ${teamResponse.foundTeam.username}`);
        const spreadHeader = screen.getByText(`Wins: ${teamResponse.foundTeam.team.win}, Losses: ${teamResponse.foundTeam.team.loss}`);
        const pointsHeader = screen.getByText(`Points: ${teamResponse.foundTeam.team.points}`);
        const pokemonHeader = screen.getByText("Pokemon");
        const battlelogHeader = screen.getByText("Battlelog");
        expect(teamHeader).toBeInTheDocument();
        expect(postedHeader).toBeInTheDocument();
        expect(spreadHeader).toBeInTheDocument();
        expect(pointsHeader).toBeInTheDocument();
        expect(pokemonHeader).toBeInTheDocument();
        expect(battlelogHeader).toBeInTheDocument();
    });
});

describe('View Comments For Team', () => {
    test('Should render comments', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ViewCommentsForTeam comments={teamComments} />);
        const firstCommenterHeading = screen.getByText(teamComments[0].username);
        const secondCommenterHeading = screen.getByText(teamComments[1].username);
        const firstComment = screen.getByText(teamComments[0].comments[0].comment);
        const secondComment = screen.getByText(teamComments[1].comments[0].comment);
        expect(firstCommenterHeading).toBeInTheDocument();
        expect(secondCommenterHeading).toBeInTheDocument();
        expect(firstComment).toBeInTheDocument();
        expect(secondComment).toBeInTheDocument();
    });
});

describe('Add Comment Form', () => {
    test('Should render form', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<AddCommentForm teamID={teamComments[0].comments[0].team_id}/>);
        const headerElem = screen.getByText("Add Comment");
        const ratingLabel = screen.getByLabelText("Rating");
        const commentLabel = screen.getByLabelText("Comment");
        const submitButtom = screen.getByText("Submit");
        const resetButtom = screen.getByText("Reset");
        expect(headerElem).toBeInTheDocument();
        expect(ratingLabel).toBeInTheDocument();
        expect(commentLabel).toBeInTheDocument();
        expect(submitButtom).toBeInTheDocument();
        expect(resetButtom).toBeInTheDocument();
    });
});

function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}