const userDAO = require('../repository/userDAO');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const saltRounds = 10;
const secretKey = process.env.PASS_SECRET_KEY;

const getAllUsers = async () => {
    const users = await userDAO.getAllUsers();
};

const getUser = async id => {
    if(!id) return null;
    const user = await userDAO.getUserById(id);
    return user;
};

const getUserByUsername = async username => {
    if(!username) return null;
    const user = await userDAO.getUserByUsername(username);
    return user;
};

const registerUser = async (username, password, email) => {
    if(!username || !password || !email) return null;
    const user_id = uuid.v4();
    let user = {
        user_id,
        username,
        password,
        email
    };
    const data = await userDAO.postUser(user);
    return data;
};

const loginUser = async (username, password) => {
    if(!username || !password) return null;
    const foundUser = getUserByUsername(username);
    if(!foundUser || !(await bcrypt.compare(password, foundUser.password))) return null;
    const token = jwt.sign(
        {
            user_id: foundUser.user_id,
            username: foundUser.username,
            email: foundUser.email
        },
        secretKey,
        {
            expiresIn: "15m"
        }
    );
    return token;
};

const authenticateUser = token => {
    if(!token) return null;
    return jwt.verify(token, secretKey); 
};

const deleteUser = async user_id => {
    if(!user_id) return null;
    const data = await userDAO.deleteUser(user_id);
    return data;
};

module.exports = {
    getAllUsers,
    getUser,
    getUserByUsername,
    registerUser,
    loginUser,
    authenticateUser,
    deleteUser
};