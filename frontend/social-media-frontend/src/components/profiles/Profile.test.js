import { render, screen } from "@testing-library/react"
import {BrowserRouter} from "react-router-dom";
import store from "../../store/store";
import {Provider} from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import ProfileEditForm from "./ProfileEditForm";
import ViewProfile from "./ViewProfile";
import ProfileScreen from "./ProfileScreen";
import ProfileCard from "./ProfileCard";

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

const userProfile = {
    name: "test user",
    email: "test@example.com",
    biography: "test user bio"
};

describe('Profile Edit Form', () => {
    test('Edit Form Should Load', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ProfileEditForm profile={userProfile} visible={true}/>);
        const nameLabelElem = screen.getByLabelText("Name");
        expect(nameLabelElem).toBeInTheDocument();
    });
    test('Placeholder Texts', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ProfileEditForm profile={userProfile} visible={true}/>);
        const namePlaceholder = screen.getByPlaceholderText(userProfile.name);
        const emailPlaceholder = screen.getByPlaceholderText(userProfile.email);
        const biographyPlaceholder = screen.getByPlaceholderText(userProfile.biography);
        expect(namePlaceholder).toBeInTheDocument();
        expect(emailPlaceholder).toBeInTheDocument();
        expect(biographyPlaceholder).toBeInTheDocument();
    });
    test('Buttons should load', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ProfileEditForm profile={userProfile} visible={true}/>);
        const submitButton = screen.getByText("Submit");
        const resetButton = screen.getByText("Reset");
        const revertButton = screen.getByText("Revert");
        expect(submitButton).toBeInTheDocument();
        expect(resetButton).toBeInTheDocument();
        expect(revertButton).toBeInTheDocument();
    });
});

describe('View Profile', () => {
    test('Card Text', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ViewProfile profile={userProfile} visible={true} />);
        const nameText = screen.getByText(userProfile.name);
        const emailText = screen.getByText(userProfile.email);
        const bioText = screen.getByText(userProfile.biography);
        expect(nameText).toBeInTheDocument();
        expect(emailText).toBeInTheDocument();
        expect(bioText).toBeInTheDocument();
    });
    test('Card Button', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ViewProfile profile={userProfile} visible={true} />);
        const editButton = screen.getByText("Edit Profile");
        expect(editButton).toBeInTheDocument();
    });
});

describe('Profile Screen', () => {
    test('Should display welcome text', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ProfileScreen />);
        const welcomeText = screen.getByText(`Welcome ${userState.userInfo.username}! You can see this because you are now logged in!`);
        expect(welcomeText).toBeInTheDocument();
    });
});

describe('Profile Card', () => {
    test('Should display card titles', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ProfileCard user={userState.userInfo} />);
        const welcomeText = screen.getByText("WELCOME!");
        const usernameText = screen.getByText(userState.userInfo.username);
        expect(welcomeText).toBeInTheDocument();
        expect(usernameText).toBeInTheDocument();
    });
});
function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}