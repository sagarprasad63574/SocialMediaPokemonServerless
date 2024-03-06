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
    const enc_password = await bcrypt.hash(password, saltRounds);
    let user = {
        user_id,
        username,
        password: enc_password,
        email
    };
    const data = await userDAO.postUser(user);
    return data;
};

const loginUser = async (username, password) => {
    if(!username || !password) return null;
    const foundUser = await getUserByUsername(username);
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

const validateUser = (username, password) => {
    
}

// const registerUser = async (receivedData) => {
//     let employee_id = uuid.v4();
//     let teams = []

//     let { response, errors } = validateRegister(receivedData);
//     if (!response) return { response: false, errors: errors }

//     let duplicatedUser = await getUserByUsername(receivedData.username);
//     if (duplicatedUser) return { response: false, errors: "Duplicated username" }

//     let hashedPassword = await bcrypt.hash(receivedData.password, BCRYPT_WORK_FACTOR);

//     let data = await userDAO.createUser({
//         employee_id: employee_id,
//         username: receivedData.username,
//         password: hashedPassword,
//         email: receivedData.email,
//         teams: teams
//     });
//     return { response: true, message: "user created" };

// }

// function validateRegister(receivedData) {
//     const validator = jsonschema.validate(receivedData, userRegisterSchema);
//     if (!validator.valid) {
//         const errs = validator.errors.map(e => e.stack);
//         logger.error(errs);
//         //throw new BadRequestError(errs); 
//         //return { response: false, errors: errs };
//     }
//     return { response: true };
// }

module.exports = {
    getAllUsers,
    getUser,
    getUserByUsername,
    registerUser,
    loginUser,
    authenticateUser,
    deleteUser
};