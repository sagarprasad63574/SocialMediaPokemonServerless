import { render, screen } from "@testing-library/react";
import RegisterScreen from "./RegisterScreen";

describe('RegisterScreen', () => {
    test('Component Registers, header should render', () => {
        render(<RegisterScreen />);
        const headerElem = screen.getByText("REGISTER USER");
        expect(headerElem).toBeInTheDocument();
    });
    test('Component Registers, form should render', () => {
        render(<RegisterScreen />);
    });
});

describe('LoginScreen', () => {
    
});