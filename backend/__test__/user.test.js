const userService = require('../service/userService');
const userDAO = require('../repository/userDAO');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const tokens = require('../util/tokens');

jest.mock('../repository/userDAO');
jest.mock('bcrypt');
jest.mock('uuid');
jest.mock('../util/tokens');


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

describe('Login Test', () => {
    test('Empty data, should return false', async () => {
        const data = await userService.loginUser({});
        expect(data.response).toBeFalsy();
    });
    test('Incomplete data, should return false', async () => {
        const incomplete = {
            username: "testuser"
        };
        const data = await userService.loginUser(incomplete);
        expect(data.response).toBeFalsy();
    });
    test('Complete data but username is incorrect, should return false', async () => {
        const complete = {
            username: "testuserr",
            password: "password"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(null);
        const data = await userService.loginUser(complete);
        expect(data.response).toBeFalsy();
    });
    test('Complete data but password is incorrect, should return false', async () => {
        const complete = {
            username: "testuser",
            password: "passwordo"
        };
        const user = {
            username: "testuser",
            password: "password",
            name: "Test User",
            email: "test@example.com"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        bcrypt.compare.mockResolvedValueOnce(false);
        const data = await userService.loginUser(complete);
        expect(data.response).toBeFalsy();
    });
    test('Complete data with correct parameters, should return true', async () => {
        const complete = {
            username: "testuser",
            password: "password"
        };
        const user = {
            username: "testuser",
            password: "password",
            name: "Test User",
            email: "test@example.com"
        };
        userDAO.getUserByUsername.mockResolvedValueOnce(user);
        bcrypt.compare.mockResolvedValueOnce(true);
        tokens.createToken.mockReturnValueOnce("ljkfdsnbveoug43bgpone34klbwnuotr");
        const data = await userService.loginUser(complete);
        expect(data.response).toBeTruthy();
        expect(data.user.username).toStrictEqual(complete.username);
    });
});

describe('Biography Test')