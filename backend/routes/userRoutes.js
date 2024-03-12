import { Router } from 'express';
import {
    registerUser,
    loginUser,
    getUserByUsername,
    getUser,
    getUsersByRole,
    getAllUsers,
    deleteUser
} from '../service/userService.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../util/expressError.js';
import { ensureLoggedIn } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const data = await registerUser(req.body);
        if (!data.response) throw new BadRequestError(data.errors);
        return res.status(201).json(data);
    } catch (error) {
        return next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const data = await loginUser(req.body);
        if (!data.response) throw new BadRequestError(data.errors);
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
        if (usernameQuery) {
            const data = await getUserByUsername(usernameQuery);
            if (!data.response) throw new NotFoundError(data.errors);
            return res.status(200).json(data);
        }
        if (useridQuery) {
            const data = await getUser(useridQuery);
            if (!data.response) throw new NotFoundError(data.errors);
            return res.status(200).json(data);
        }
        if (roleQuery) {
            const data = await getUsersByRole(roleQuery)
            if (!data.response) throw new NotFoundError(data.errors);
            return res.status(200).json(data);
        }
        const data = await getAllUsers();
        if (!data.response) throw new NotFoundError(data.errors);
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
});

router.delete('/', async (req, res, next) => {
    const useridQuery = req.query.user_id;
    try {
        if (!useridQuery) throw new BadRequestError("User id not present");
        const data = await deleteUser(useridQuery);
        if (!data.response) throw new BadRequestError(data.errors);
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
});

export default router;