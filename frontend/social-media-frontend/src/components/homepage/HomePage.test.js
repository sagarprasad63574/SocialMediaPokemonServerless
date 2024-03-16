import { render, screen } from '@testing-library/react';
import HomePageController from './HomePageController';
import ViewAllPostedTeams from './ViewAllPostedTeams';
import ViewPokemon from './ViewPokemon';
import ViewUsersTeams from './ViewUsersTeams';
import postedTeamsAPI from '../../api/postedTeams/postedTeamsAPI';

module.jest.mock('../../api/postedTeams/postedTeamsAPI');

describe('HomePageController', () => {
    test('HomePageController renders, header element should be in document', () => {
        render(<HomePageController/>);
        const headElement = screen.getByText("WELCOME TO SOCIAL MEDIA POKEMON");
        expect(headElement).toBeInTheDocument();
    });    
});
describe('ViewAllPostedTeams', () => {
    
});
describe('ViewPokemon', () => {
    
});
describe('ViewUsersTeams', () => {
    
});
