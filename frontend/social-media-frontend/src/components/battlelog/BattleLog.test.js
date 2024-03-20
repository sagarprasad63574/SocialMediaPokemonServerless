import { render, screen } from "@testing-library/react"
import {BrowserRouter} from "react-router-dom";
import store from "../../store/store";
import {Provider} from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import BattleLogView from "./BattleLogView";

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

describe('BattleLog', () => {
    test('Should render no battlelog', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<BattleLogView battlelog={[]} />);
        const noLogElem = screen.getByText("No Battle Log");
        expect(noLogElem).toBeInTheDocument();
    });
    test('Should render a battlelog', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<BattleLogView battlelog={[{summary: "pokemon fainted", details: ["pokemon1 killed pokemon2"]}]} />);
        const battlelogHeader = screen.getByText("BattleLog");
        expect(battlelogHeader).toBeInTheDocument();
    })
});

function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}