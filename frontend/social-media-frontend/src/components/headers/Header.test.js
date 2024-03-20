import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import {Provider} from "react-redux";
import store from '../../store/store';
import Header from "./Header";

describe('Header Element should be rendered', () => {
    test('Should render', () => {
        renderWithContext(<Header />);
        const brandElem = screen.getByText("Social Media Pokemon");
        expect(brandElem).toBeInTheDocument();
    });
});

describe('Header Links', () => {
    test('Home link should render', () => {
        renderWithContext(<Header />);
        const homeElem = screen.getByText("Home");
        expect(homeElem).toBeInTheDocument();
    });
    test('Profile link should render', () => {
        renderWithContext(<Header />);
        const profileElem = screen.getByText("Profile");
        expect(profileElem).toBeInTheDocument();
    });
    test('Search link should render', () => {
        renderWithContext(<Header />);
        const searchElem = screen.getByText("Search");
        expect(searchElem).toBeInTheDocument();
    });
    test('Teams link should render', () => {
        renderWithContext(<Header />);
        const teamsElem = screen.getByText("Teams");
        expect(teamsElem).toBeInTheDocument();
    });
    test('Comments link should render', () => {
        renderWithContext(<Header />);
        const commentsElem = screen.getByText("Comments");
        expect(commentsElem).toBeInTheDocument();
    });
    test('Create Pokemon link should render', () => {
        renderWithContext(<Header />);
        const createElem = screen.getByText("Create");
        expect(createElem).toBeInTheDocument();
    });
    test('Battle link should render', () => {
        renderWithContext(<Header />);
        const battleElem = screen.getByText("Battle");
        expect(battleElem).toBeInTheDocument();
    });
});

function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}