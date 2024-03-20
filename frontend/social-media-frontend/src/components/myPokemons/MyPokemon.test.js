import { render, screen } from "@testing-library/react"
import {BrowserRouter} from "react-router-dom";
import store from "../../store/store";
import {Provider} from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import CreatePokemonContainer from "./CreatePokemonContainer";
import ViewCreatedPokemons from "./ViewCreatedPokemons";
import EditPokemonContainer from "./EditPokemonContainer";
import DeletePokemonContainer from "./DeletePokemonContainer";

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

const createdPoke = [{
    defense: 90,
    attack: 80,
    pokemon_id: "3f16c559-ce6b-4bd7-868d-4609df14c70d",
    hp: 99,
    specialattack: 50,
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
    speed: 80
}];

describe('Create Pokemon Container', () => {
    test('Should render container', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<CreatePokemonContainer />);
        const pokemonHeader = screen.getByText("CREATE POKEMON");
        const imageHeader = screen.getByLabelText("Image");
        const nameHeader = screen.getByLabelText("Pokemon Name");
        const attackHeader = screen.getByLabelText("Attack Power");
        const defenseHeader = screen.getByLabelText("Defense Power");
        const specialAttackHeader = screen.getByLabelText("Special Attack Power");
        const specialDefenseHeader = screen.getByLabelText("Special Defense Power");
        const speedHeader = screen.getByLabelText("Speed");
        const hpHeader = screen.getByLabelText("HP");
        expect(pokemonHeader).toBeInTheDocument();
        expect(imageHeader).toBeInTheDocument();
        expect(nameHeader).toBeInTheDocument();
        expect(attackHeader).toBeInTheDocument();
        expect(defenseHeader).toBeInTheDocument();
        expect(specialAttackHeader).toBeInTheDocument();
        expect(specialDefenseHeader).toBeInTheDocument();
        expect(speedHeader).toBeInTheDocument();
        expect(hpHeader).toBeInTheDocument();
    });
});

describe('View Created Pokemons', () => {
    test('Should render pokemon field', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ViewCreatedPokemons />);
        const pokeHeader = screen.getByText("View Pokemons");
        expect(pokeHeader).toBeInTheDocument();
    });
});

describe('Edit Pokemon Container', () => {
    test('Should Render Edit Form', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<EditPokemonContainer pokemon_index={0} createdPokemons={createdPoke} />);
        const namePlaceholder = screen.getByPlaceholderText("Enter Pokemon Name");
        const attackLabel = screen.getByLabelText("Attack Power");
        const defenseLabel = screen.getByLabelText("Defense Power");
        const specialAttackLabel = screen.getByLabelText("Special Attack Power");
        const specialDefenseLabel = screen.getByLabelText("Special Defense Power");
        const speedLabel = screen.getByLabelText("Speed");
        const hpLabel = screen.getByLabelText("HP");
        const submitButton = screen.getByText("Submit");
        expect(namePlaceholder).toBeInTheDocument();
        expect(attackLabel).toBeInTheDocument();
        expect(defenseLabel).toBeInTheDocument();
        expect(specialAttackLabel).toBeInTheDocument();
        expect(specialDefenseLabel).toBeInTheDocument();
        expect(speedLabel).toBeInTheDocument();
        expect(hpLabel).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });
});

describe('Delete Pokemon Container', () => {
    test('Should render alert', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<DeletePokemonContainer pokemon={createdPoke[0]} pokemon_index={0} createdPokemons={createdPoke} />);
        const alertHeading = screen.getByText(`DELETE POKEMON: ${createdPoke[0].pokemon_name}`);
        const yesButton = screen.getByText("Yes");
        expect(alertHeading).toBeInTheDocument();
        expect(yesButton).toBeInTheDocument();
    });
});

function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}