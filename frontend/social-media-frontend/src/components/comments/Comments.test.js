import { render, screen } from "@testing-library/react"
import {BrowserRouter} from "react-router-dom";
import store from "../../store/store";
import { setCredentials } from "../../store/slices/authSlice";
import {Provider} from "react-redux";
import CommentsContainer from "./CommentsContainer";
import EditCommentForm from "./EditCommentForm";
import DeleteCommentForm from "./DeleteCommentForm";

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

const comments = [{
    "rating": 5,
    "comment": "This is a test comment",
    "team_id": "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
    "timestamp": "2024-03-20T02:55:27.543Z"
}];

describe('Comments Container', () => {
    test('Should show comment header and buttons', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<CommentsContainer />);
        const commentHeader = screen.getByText(`Comments made by user ${userState.userInfo.username}`);
        const editButton = screen.getByText("Edit Comments");
        const deleteButton = screen.getByText("Delete Comments");
        expect(commentHeader).toBeInTheDocument();
        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
    });
});

describe('Edit Comment Form', () => {
    test('Should not have index', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<EditCommentForm comments={comments} />);
        const indexLabel = screen.getByLabelText("Comment Index");
        const searchButton = screen.getByText("Search");
        expect(indexLabel).toBeInTheDocument();
        expect(searchButton).toBeInTheDocument();
    });
});

describe('Delete Comment Form', () => {
    test('Should not have index', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<DeleteCommentForm comments={comments} />);
        const indexLabel = screen.getByLabelText("Comment Index");
        const searchButton = screen.getByText("Search");
        expect(indexLabel).toBeInTheDocument();
        expect(searchButton).toBeInTheDocument();
    });
})

function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}