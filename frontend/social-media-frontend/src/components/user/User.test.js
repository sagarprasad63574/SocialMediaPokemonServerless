import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RegisterScreen from "./RegisterScreen";
import LoginScreen from "./LoginScreen";
import authActions from '../../store/actions/authActions';
import {Provider} from "react-redux";
import store from '../../store/store';

describe('Register Screen Test', () => {
    test("Register Component Loads", () => {
        renderWithContext(<RegisterScreen />);
        const headerElem = screen.getByText("REGISTER USER");
        expect(headerElem).toBeInTheDocument();
    });
    test('Register Component should show a form object', () => {
        renderWithContext(<RegisterScreen />);
        const formNameText = screen.getByLabelText("Name");
        const formEmailText = screen.getByLabelText("Email");
        const formUsernameText = screen.getByLabelText("Username");
        const formPasswordText = screen.getByLabelText("Password");
        const formConfirmPasswordText = screen.getByLabelText("Confirm Password");
        expect(formNameText).toBeInTheDocument();
        expect(formEmailText).toBeInTheDocument();
        expect(formUsernameText).toBeInTheDocument();
        expect(formPasswordText).toBeInTheDocument();
        expect(formConfirmPasswordText).toBeInTheDocument();
    });
});

describe('Login Screen Test', () => {
    test("Login Component Loads", () => {
        renderWithContext(<LoginScreen />);
        const headerElem = screen.getByText("WELCOME LOGIN");
        expect(headerElem).toBeInTheDocument();
    });
    test('Login Form Loads', () => {
        renderWithContext(<LoginScreen />);
        const formUsernameText = screen.getByLabelText("Username");
        const formPasswordText = screen.getByLabelText("Password");
        expect(formUsernameText).toBeInTheDocument();
        expect(formPasswordText).toBeInTheDocument();
    });
});

function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}