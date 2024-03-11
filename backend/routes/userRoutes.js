const express = require('express');
const userService = require('../service/userService');
const { BadRequestError, NotFoundError } = require('../util/expressError');
const { ensureLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const data = await userService.registerUser(req.body);
        if(!data.response) throw new BadRequestError(data.errors);
        return res.status(201).json(data);
    } catch (error) {
        return next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const data = await userService.loginUser(req.body);
        if(!data.response) throw new BadRequestError(data.errors);
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
});

router.get('/', ensureLoggedIn, async (req, res, next) => {
    const usernameQuery = req.query.username;
    const useridQuery = req.query.user_id;
    const roleQuery = req.query.role;
    try {
        if(usernameQuery){
            const data = await userService.getUserByUsername(usernameQuery);
            if(!data.response) throw new NotFoundError(data.errors);
            return res.status(200).json(data);
        }
        if(useridQuery){
            const data = await userService.getUser(useridQuery);
            if(!data.response) throw new NotFoundError(data.errors);
            return res.status(200).json(data);
        }
        if(roleQuery){
            const data = await userService.getUsersByRole(roleQuery)
            if(!data.response) throw new NotFoundError(data.errors);
            return res.status(200).json(data);
        }
        const data = await userService.getAllUsers();
        if(!data.response) throw new NotFoundError(data.errors);
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
});

router.delete('/', async (req, res, next) => {
    const useridQuery = req.query.user_id;
    try {
        if(!useridQuery) throw new BadRequestError("User id not present");
        const data = await userService.deleteUser(useridQuery);
        if(!data.response) throw new BadRequestError(data.errors);
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;