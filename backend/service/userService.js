const userDAO = require('../repository/userDAO');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { BCRYPT_WORK_FACTOR } = require('../config');
const jsonschema = require('jsonschema');
const userRegisterSchema = require('../schemas/userRegisterSchema.json');
const userLoginSchema = require('../schemas/userLoginSchema.json');
const userProfileSchema = require('../schemas/userProfileSchema.json');
const { createToken } = require('../util/tokens');
dotenv.config();


const getAllUsers = async () => {
    const users = await userDAO.getAllUsers();
    if(!users || !users.length) return {response: false, errors: "No users"};
    return {response: true, message: "Got all users", users};
};

const getUser = async user_id => {
    if(!user_id) return {response: false, errors: "No user id provided"}
    const user = await userDAO.getUserById(user_id);
    if(!user) return {response: false, errors: `No user found with id ${user_id}`}
    return {response: true, message: `Got user with id ${user_id}`, user};
};

const getUserByUsername = async username => {
    if(!username) return {response: false, errors: "No username provided"};
    const user = await userDAO.getUserByUsername(username);
    if(!user) return {response: false, errors: `No user found with username ${username}`};
    return {response: true, message: `Got user with username ${username}`, user};
};

const getUsersByRole = async role => {
    if(!role) return {response: false, errors: "No role provided"};
    const users = await userDAO.getUsersByRole(role);
    if(!users || !users.length) return {response: false, errors: `No users found with role ${role}`};
    return {response: true, message: `Got users with role ${role}`, users};
}

const deleteUser = async user_id => {
    if(!user_id) return {response: false, errors: "No user id provided"};
    const data = await userDAO.deleteUser(user_id);
    if(!data) return {response: false, errors: `Could not delete user with id ${user_id}`};
    return {response: true, message: `Deleted user with id ${user_id}`};
};

const registerUser = async (receivedData) => {
    const validated = validateRegister(receivedData);
    if(!validated.response) return {response: false, errors: validated.errors};
    const foundUser = await userDAO.getUserByUsername(receivedData.username);
    if(foundUser) return {response: false, errors: `User already exists with username ${receivedData.username}`};
    const user_id = uuid.v4();
    const teams = [];
    const my_pokemons = [];
    const comments = [];
    const biography = "";
    const enc_password = await bcrypt.hash(receivedData.password, BCRYPT_WORK_FACTOR);
    const newUser = {
        user_id,
        username: receivedData.username,
        password: enc_password,
        name: receivedData.name,
        email: receivedData.email,
        role: receivedData.role ? receivedData.role : "user",
        teams,
        my_pokemons,
        biography,
        comments
    };
    const data = await userDAO.postUser(newUser);
    if(!data) return {response: false, errors: "Could not create user"};
    return {response: true, message: `Successfully created user ${receivedData.username}`};
}

const validateRegister = receivedData => {
    const validator = jsonschema.validate(receivedData, userRegisterSchema);
    if(!validator.valid){
        const errs = validator.errors.map(e => e.stack);
        return {response: false, errors: errs};
    }
    return {response: true};
};

const loginUser = async receivedData => {
    const validated = validateLogin(receivedData);
    if(!validated.response) return {response: false, errors: validated.errors};
    const foundUser = await userDAO.getUserByUsername(receivedData.username);
    if(!foundUser) return {response: false, errors: "User does not exist"};
    if(!(await bcrypt.compare(receivedData.password, foundUser.password))) return {response: false, errors: "Incorrect password"};
    const token = createToken(foundUser);
    const user = {
        user_id: foundUser.user_id,
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role
    };
    return {response: true, message: `User ${foundUser.username} logged in successfully`, token, user};
};

const validateLogin = receivedData => {
    const validator = jsonschema.validate(receivedData, userLoginSchema);
    if(!validator.valid){
        const errs = validator.errors.map(e => e.stack);
        return {response: false, errors: errs};
    }
    return {response: true};
}

const editProfile = async receivedData => {
    const validated = validateProfile(receivedData);
    if(!validated.response) return {response: false, errors: validated.errors};
    const foundUser = await userDAO.getUserByUsername(receivedData.username);
    if(!foundUser) return {response: false, errors: "User does not exist"};
    foundUser.biography = receivedData.biography;
    foundUser.name = receivedData.name;
    foundUser.email = receivedData.email;
    const data = await userDAO.updateUser(foundUser.user_id, foundUser);
    if(!data) return {response: false, errors: "Could not update user profile"};
    return {response: true, message: `User ${receivedData.username} profile updated successfully`};
}

const validateProfile = receivedData => {
    const validator = jsonschema.validate(receivedData, userProfileSchema);
    if(!validator.valid){
        const errs = validator.errors.map(e => e.stack);
        return {response: false, errors: errs};
    }
    return {response: true};
}

module.exports = {
    getAllUsers,
    getUser,
    getUserByUsername,
    getUsersByRole,
    registerUser,
    loginUser,
    editProfile,
    deleteUser
};