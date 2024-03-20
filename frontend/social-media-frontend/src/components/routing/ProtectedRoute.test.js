import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoutes";
import { BrowserRouter } from "react-router-dom";
import {Provider} from "react-redux";
import store from '../../store/store';

describe('Testing Route Guard', () => {
    test('Should Render', () => {
        renderWithContext(<ProtectedRoute />);
        const unAuthElem = screen.getByText("Unauthorized :(");
        expect(unAuthElem).toBeInTheDocument();
    })
});

function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}