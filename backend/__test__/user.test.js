const userService = require('../service/userService');
const userDAO = require('../repository/userDAO');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

jest.mock('../repository/userDAO');
jest.mock('bcrypt');
jest.mock('uuid');

describe('Register Test', () => {
    test('Empty data, should return false', async () => {
        const data = await userService.registerUser({});
        expect(data.response).toBeFalsy();
    });
    test('Incomplete data, should return false', async () => {
        const incomplete = {
            username: "testuser",
            password: "testpass"
        };
        const data = await userService.registerUser(incomplete);
        expect(data.response).toBeFalsy();
    });
    test('Complete data but user already exists, should return false', async () => {
        const complete = {
            username: "testuser",
            password: "testpass",
            name: "test user",
            email: "test@example.com"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce({...complete, user_id: "0"});
        const data = await userService.registerUser(complete);
        expect(data.response).toBeFalsy();
    });
    test('Complete data and user is unique, should return true', async () => {
        const complete = {
            username: "testuser",
            password: "testpass",
            name: "test user",
            email: "test@example.com"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce();
        uuid.v4.mockReturnValueOnce("1");
        bcrypt.hash.mockResolvedValueOnce("rewpqi");
        userDAO.postUser.mockResolvedValueOnce(true);
        const data = await userService.registerUser(complete);
        expect(data.response).toBeTruthy();
    });
});

//TODO: Add Login Tests