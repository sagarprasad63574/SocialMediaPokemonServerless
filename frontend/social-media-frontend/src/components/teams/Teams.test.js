import { render } from "@testing-library/react"
import {BrowserRouter} from "react-router-dom";
import store from "../../store/store";
import {Provider} from "react-redux";

function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}