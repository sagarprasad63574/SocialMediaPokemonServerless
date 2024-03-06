const userService = require('../service/userService');
const userDAO = require('../repository/userDAO');
const bcrypt = require('bcrypt');

jest.mock('../repository/userDAO');
jest.mock('bcrypt');

describe('Register Test', () => {
    test('Empty data, should return false', async () => {
        const data = await userService.registerUser({});
        expect(data.response).toBeFalsy();
    });
});