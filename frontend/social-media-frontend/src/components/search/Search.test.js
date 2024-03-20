import { render, screen } from "@testing-library/react"
import {BrowserRouter} from "react-router-dom";
import store from "../../store/store";
import {Provider} from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import SearchPokemonContainer from "./SearchPokemonContainer";
import ViewPokemonContainer from "./ViewPokemonContainer";
import ViewMyTeams from "./ViewMyTeams";

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

const pokemon = {
    pokemon_name: "charizard",
    height: 17,
    weight: 905,
    base_experience: 267,
    stats: [{
        base_stat: 78,
        effort: 0,
        stat: {
            name: "hp",
            url: "https://pokeapi.co/api/v2/stat/1/"
        }
    },
    {
        base_stat: 84,
        effort: 0,
        stat: {
            name: "attack",
            url: "https://pokeapi.co/api/v2/stat/2/"
        }
    },
    {
        base_stat: 78,
        effort: 0,
        stat: {
            name: "defense",
            url: "https://pokeapi.co/api/v2/stat/3/"
        }
    },
    {
        base_stat: 109,
        effort: 3,
        stat: {
            name: "special-attack",
            url: "https://pokeapi.co/api/v2/stat/4/"
        }
    },
    {
        base_stat: 85,
        effort: 0,
        stat: {
            name: "special-defense",
            url: "https://pokeapi.co/api/v2/stat/5/"
        }
    },
    {
        base_stat: 100,
        effort: 0,
        stat: {
            name: "speed",
            url: "https://pokeapi.co/api/v2/stat/6/"
        }
    }],
    types: [{
        slot: 1,
        type: {
            name: "fire",
            url: "https://pokeapi.co/api/v2/type/10/"
        }
    },
    {
        slot: 2,
        type: {
            name: "flying",
            url: "https://pokeapi.co/api/v2/type/3/"
        }
    }],
    sprites: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png"
};

const teams = [{
    battlelog: [],
    loss: 0,
    points: 0,
    pokemons: [],
    post: true,
    team_id: "d1349ece-6e1e-469f-bf4e-e4bf0d1594dc",
    team_name: "test_team",
    win: 0
}];

describe('Search Pokemon Container', () => {
    test('Should render form', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<SearchPokemonContainer />);
        const searchLabel = screen.getByText("Search for pokemon name");
        const enterPlaceholder = screen.getByPlaceholderText("Enter pokemon name");
        const searchButton = screen.getByText("Search");
        expect(searchLabel).toBeInTheDocument();
        expect(enterPlaceholder).toBeInTheDocument();
        expect(searchButton).toBeInTheDocument();
    });
});

describe('View Pokemon Container', () => {
    test('Should render container', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ViewPokemonContainer pokemon={pokemon}/>);
        const cardTitle = screen.getByText(pokemon.pokemon_name);
        const heightText = screen.getByText(`Height: ${pokemon.height}`);
        const weightText = screen.getByText(`Weight: ${pokemon.weight}`);
        const baseExperienceText = screen.getByText(`Base Experience: ${pokemon.base_experience}`);
        expect(cardTitle).toBeInTheDocument();
        expect(heightText).toBeInTheDocument();
        expect(weightText).toBeInTheDocument();
        expect(baseExperienceText).toBeInTheDocument();
    });
});

describe('View My Teams', () => {
    test('Should render dropdown', () => {
        store.dispatch(setCredentials(userState.userInfo));
        renderWithContext(<ViewMyTeams teams={teams} pokemon_name={pokemon.pokemon_name} />);
        const teamDropdown = screen.getByText(teams[0].team_name);
        expect(teamDropdown).toBeInTheDocument();
    });
});

function renderWithContext(element){
    render(<Provider store={store}><BrowserRouter>{element}</BrowserRouter></Provider>)
}