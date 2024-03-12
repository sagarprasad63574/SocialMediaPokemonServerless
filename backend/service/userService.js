import {
    getAllUsers as _getAllUsers,
    getUserById,
    getUserByUsername as _getUserByUsername,
    getUsersByRole as _getUsersByRole,
    deleteUser as _deleteUser,
    postUser,
    updateUser
} from '../repository/userDAO.js';
import { v4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { BCRYPT_WORK_FACTOR } from '../config.js';
import { validate } from 'jsonschema';
import userRegisterSchema from '../schemas/userRegisterSchema.json'assert { type: "json" };
import userLoginSchema from '../schemas/userLoginSchema.json'assert { type: "json" };
import userProfileSchema from '../schemas/userProfileSchema.json'assert { type: "json" };
import { createToken } from '../util/tokens.js';

const getAllUsers = async () => {
    const users = await _getAllUsers();
    if (!users || !users.length) return { response: false, errors: "No users" };
    return { response: true, message: "Got all users", users };
};

const getUser = async user_id => {
    if (!user_id) return { response: false, errors: "No user id provided" }
    const user = await getUserById(user_id);
    if (!user) return { response: false, errors: `No user found with id ${user_id}` }
    return { response: true, message: `Got user with id ${user_id}`, user };
};

const getUserByUsername = async username => {
    if (!username) return { response: false, errors: "No username provided" };
    const user = await _getUserByUsername(username);
    if (!user) return { response: false, errors: `No user found with username ${username}` };
    return { response: true, message: `Got user with username ${username}`, user };
};

const getUsersByRole = async role => {
    if (!role) return { response: false, errors: "No role provided" };
    const users = await _getUsersByRole(role);
    if (!users || !users.length) return { response: false, errors: `No users found with role ${role}` };
    return { response: true, message: `Got users with role ${role}`, users };
}

const deleteUser = async user_id => {
    if (!user_id) return { response: false, errors: "No user id provided" };
    const data = await _deleteUser(user_id);
    if (!data) return { response: false, errors: `Could not delete user with id ${user_id}` };
    return { response: true, message: `Deleted user with id ${user_id}` };
};

const registerUser = async (receivedData) => {
    const validated = validateRegister(receivedData);
    if (!validated.response) return { response: false, errors: validated.errors };
    const foundUser = await _getUserByUsername(receivedData.username);
    if (foundUser) return { response: false, errors: `User already exists with username ${receivedData.username}` };
    const user_id = v4();
    const teams = [];
    const my_pokemons = [];
    const comments = [];
    const biography = "";
    const enc_password = await hash(receivedData.password, BCRYPT_WORK_FACTOR);
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
    const data = await postUser(newUser);
    if (!data) return { response: false, errors: "Could not create user" };
    return { response: true, message: `Successfully created user ${receivedData.username}` };
}

const validateRegister = receivedData => {
    const validator = validate(receivedData, userRegisterSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        return { response: false, errors: errs };
    }
    return { response: true };
};

const loginUser = async receivedData => {
    const validated = validateLogin(receivedData);
    if (!validated.response) return { response: false, errors: validated.errors };
    const foundUser = await _getUserByUsername(receivedData.username);
    if (!foundUser) return { response: false, errors: "User does not exist" };
    if (!(await compare(receivedData.password, foundUser.password))) return { response: false, errors: "Incorrect password" };
    const userToken = createToken(foundUser);
    const user = {
        user_id: foundUser.user_id,
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role
    };
    return { response: true, message: `User ${foundUser.username} logged in successfully`, userToken, ...user };
};

const validateLogin = receivedData => {
    const validator = validate(receivedData, userLoginSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        return { response: false, errors: errs };
    }
    return { response: true };
}

const editProfile = async receivedData => {
    const validated = validateProfile(receivedData);
    if (!validated.response) return { response: false, errors: validated.errors };
    const foundUser = await _getUserByUsername(receivedData.username);
    if (!foundUser) return { response: false, errors: "User does not exist" };
    foundUser.biography = receivedData.biography;
    foundUser.name = receivedData.name;
    foundUser.email = receivedData.email;
    const data = await updateUser(foundUser.user_id, foundUser);
    if (!data) return { response: false, errors: "Could not update user profile" };
    return { response: true, message: `User ${receivedData.username} profile updated successfully` };
}

const validateProfile = receivedData => {
    const validator = validate(receivedData, userProfileSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        return { response: false, errors: errs };
    }
    return { response: true };
}

export {
    getAllUsers,
    getUser,
    getUserByUsername,
    getUsersByRole,
    registerUser,
    loginUser,
    editProfile,
    deleteUser
};