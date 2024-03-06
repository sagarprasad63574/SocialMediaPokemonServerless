const express = require('express');
const cors = require('cors');
const logger = require('./util/logger');
const userService = require('./service/userService');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    logger.info(`${req.method} request at ${req.url}`);
    next();
});

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (!username || !password || !email) return res.status(400).json({ message: "You must provide a username, password, and email" });
    const data = await userService.registerUser(username, password, email);
    if (data) return res.status(201).json({ message: `User ${username} created`, data });
    else return res.status(400).json({ message: `User ${username} already exists` });
});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    //throw new BadRequestError(errs)
    if (!username || !password) return res.status(400).json({ message: "You must provide a username and password" });
    const token = await userService.loginUser(username, password);
    if (!token) return res.status(400).json({ message: "Username and/or password incorrect" });
    return res.status(200).json({ message: "User logged in successfully", token });
});

//throw new BadRequestError(errs);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});